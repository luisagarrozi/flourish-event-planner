// Environment variables validation and security

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  NODE_ENV: string;
}

function validateEnv(): EnvConfig {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  
  for (const key of required) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  // Validate Supabase URL format
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    throw new Error('Invalid Supabase URL format');
  }

  // Validate anon key format (should be a long string)
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (anonKey.length < 100) {
    throw new Error('Invalid Supabase anon key format');
  }

  return {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: anonKey,
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
  };
}

export const env = validateEnv();

// Security check for production
if (env.NODE_ENV === 'production') {
  // Ensure HTTPS in production
  if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
    console.warn('Application should be served over HTTPS in production');
  }
}
