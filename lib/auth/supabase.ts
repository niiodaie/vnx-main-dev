import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
let supabaseInstance: SupabaseClient | null = null;

function getSupabase() {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// Export getter instead of direct client
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabase();
    if (!client) {
      throw new Error('Supabase not configured');
    }
    return (client as any)[prop];
  }
});

// Helper to get current user
export async function getCurrentUser() {
  const client = getSupabase();
  if (!client) return null;
  
  try {
    const { data: { user } } = await client.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Helper to get user tier
export async function getUserTier(userId: string): Promise<'free' | 'pro'> {
  const client = getSupabase();
  if (!client) return 'free';
  
  try {
    const { data, error } = await client
      .from('user_subscriptions')
      .select('tier, status, expires_at')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return 'free';
    }

    // Check if subscription is active and not expired
    if (data.tier === 'pro' && data.status === 'active') {
      const expiresAt = new Date(data.expires_at);
      if (expiresAt > new Date()) {
        return 'pro';
      }
    }

    return 'free';
  } catch (error) {
    console.error('Error getting user tier:', error);
    return 'free';
  }
}

// Helper to check if user is pro
export async function isProUser(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId);
  return tier === 'pro';
}

// Helper to get subscription details
export async function getSubscriptionDetails(userId: string) {
  const client = getSupabase();
  if (!client) return null;
  
  try {
    const { data, error } = await client
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error getting subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting subscription details:', error);
    return null;
  }
}

// Helper to log API usage
export async function logApiUsage(params: {
  userId?: string;
  ipAddress: string;
  tool: string;
  requestData?: any;
  responseData?: any;
  success: boolean;
  errorMessage?: string;
  tier: 'free' | 'pro';
}) {
  const client = getSupabase();
  if (!client) return;
  
  try {
    await client.from('netscan_logs').insert({
      user_id: params.userId || null,
      ip_address: params.ipAddress,
      tool: params.tool,
      request_data: params.requestData,
      response_data: params.responseData,
      success: params.success,
      error_message: params.errorMessage,
      tier: params.tier,
    });
  } catch (error) {
    console.error('Error logging API usage:', error);
  }
}

// Helper to log errors
export async function logError(params: {
  userId?: string;
  tool?: string;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  requestData?: any;
}) {
  const client = getSupabase();
  if (!client) return;
  
  try {
    await client.from('error_logs').insert({
      user_id: params.userId || null,
      tool: params.tool,
      error_type: params.errorType,
      error_message: params.errorMessage,
      stack_trace: params.stackTrace,
      request_data: params.requestData,
      resolved: false,
    });
  } catch (error) {
    console.error('Error logging error:', error);
  }
}

// Auth helper functions
export async function signInWithEmail(email: string, password: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signInWithOAuth(provider: 'google' | 'github') {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  
  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signInWithMagicLink(email: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  
  const { data, error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = getSupabase();
  if (!client) return;
  await client.auth.signOut();
}

