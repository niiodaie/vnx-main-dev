export const runtime = "nodejs";
import { createCheckoutSession } from "@/lib/payments";

export async function POST(req: Request) {
  const { email } = await req.json();
  const checkoutUrl = await createCheckoutSession(email);
  return new Response(JSON.stringify({ url: checkoutUrl }), { status: 200 });
}
