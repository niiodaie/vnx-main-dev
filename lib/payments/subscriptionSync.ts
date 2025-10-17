import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function updateSubscriptionStatus(email: string, status: string) {
  await supabase
    .from("user_subscriptions")
    .upsert({ email, status, updated_at: new Date().toISOString() });
}
