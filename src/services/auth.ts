import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

// Cache for user data
let userCache: { user: User; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function signUp(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});
	return { data, error };
}

export async function signIn(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	// Clear cache on sign in
	userCache = null;
	return { data, error };
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	// Clear cache on sign out
	userCache = null;
	return { error };
}

export async function getCurrentUser(): Promise<User | null> {
	console.log("🔍 auth: getCurrentUser called");
	// Check if we have a valid cached user
	if (userCache && Date.now() - userCache.timestamp < CACHE_DURATION) {
		console.log("🔍 auth: Returning cached user");
		return userCache.user;
	}

	console.log("🔍 auth: No cache, calling supabase.auth.getUser");
	const { data: { user } } = await supabase.auth.getUser();
	console.log("🔍 auth: supabase.auth.getUser result =", user);
	
	// Cache the user data
	if (user) {
		userCache = { user, timestamp: Date.now() };
		console.log("🔍 auth: User cached");
	} else {
		userCache = null;
		console.log("🔍 auth: No user found, cache cleared");
	}
	
	return user;
}

export async function getSession() {
	const { data: { session } } = await supabase.auth.getSession();
	return session;
}

// Function to clear cache (useful for testing or manual refresh)
export function clearUserCache() {
	userCache = null;
}

// Listen for auth state changes to update cache
supabase.auth.onAuthStateChange((event, session) => {
	if (event === 'SIGNED_IN' && session?.user) {
		userCache = { user: session.user, timestamp: Date.now() };
	} else if (event === 'SIGNED_OUT') {
		userCache = null;
	}
});
