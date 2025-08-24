import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

interface UseApiCacheOptions {
  cacheDuration?: number; // in milliseconds
  enabled?: boolean;
}

export function useApiCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseApiCacheOptions = {}
) {
  console.log("🔍 useApiCache: Hook initialized with key =", key);
  const { cacheDuration = 5 * 60 * 1000, enabled = true } = options; // 5 minutes default
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchFnRef = useRef(fetchFn);
  
  // Update the ref when fetchFn changes
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    console.log("🔍 useApiCache: fetchData called with key =", key, "forceRefresh =", forceRefresh);
    if (!enabled) {
      console.log("🔍 useApiCache: Hook disabled, returning");
      return;
    }

    const now = Date.now();
    const cacheEntry = cacheRef.current.get(key);
    console.log("🔍 useApiCache: Cache entry =", cacheEntry);

    // Return cached data if it's still valid
    if (!forceRefresh && cacheEntry && (now - cacheEntry.timestamp) < cacheDuration) {
      console.log("🔍 useApiCache: Returning cached data");
      setData(cacheEntry.data);
      setError(null);
      return cacheEntry.data;
    }

    // If there's an ongoing request, wait for it
    if (cacheEntry?.promise) {
      console.log("🔍 useApiCache: Waiting for ongoing request");
      try {
        const result = await cacheEntry.promise;
        setData(result);
        setError(null);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    console.log("🔍 useApiCache: Starting new request");
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 useApiCache: Calling fetchFn");
      const promise = fetchFnRef.current();
      
      // Store the promise in cache to prevent duplicate requests
      cacheRef.current.set(key, {
        data: null as T,
        timestamp: now,
        promise
      });

      console.log("🔍 useApiCache: Waiting for promise to resolve");
      const result = await promise;
      console.log("🔍 useApiCache: Promise resolved with result =", result);

      // Update cache with actual data
      cacheRef.current.set(key, {
        data: result,
        timestamp: now
      });

      setData(result);
      setError(null);
      return result;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }
      
      setError(err as Error);
      cacheRef.current.delete(key);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, enabled, cacheDuration]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(() => {
    cacheRef.current.delete(key);
    setData(null);
  }, [key]);

  useEffect(() => {
    console.log("🔍 useApiCache: useEffect triggered for key =", key);
    fetchData();
  }, [key, enabled, fetchData]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
    clearCache
  };
}
