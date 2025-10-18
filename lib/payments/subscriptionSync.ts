import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization to avoid build-time errors
let supabaseInstance: SupabaseClient | null = null;

function getSupabase() {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Supabase credentials not configured for subscription sync');
    return null;
  }
  
  supabaseInstance = createClient(supabaseUrl, serviceRoleKey);
  return supabaseInstance;
}

export async function updateSubscriptionStatus(email: string, status: string) {
  const supabase = getSupabase();
  if (!supabase) {
    console.error('Supabase not configured, cannot update subscription');
    return;
  }
  
  await supabase
    .from("user_subscriptions")
    .upsert({ email, status, updated_at: new Date().toISOString() });
}

