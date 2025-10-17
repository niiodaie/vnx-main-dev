export const runtime = "nodejs";
import { updateSubscriptionStatus } from "@/lib/payments/subscriptionSync";

export async function POST(req: Request) {
  const body = await req.text();
  const payload = JSON.parse(body);

  const email = payload.data?.attributes?.user_email;
  const status = payload.data?.attributes?.status ?? "unknown";

  if (email) await updateSubscriptionStatus(email, status);

  return new Response("Lemon Webhook OK", { status: 200 });
}
