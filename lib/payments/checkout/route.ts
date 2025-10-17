// lib/payments/checkout/route.ts
import { createCheckoutSession } from "@/lib/payments";

export async function POST(req: Request) {
  const { email, priceId } = await req.json(); // ✅ include priceId

  if (!email || !priceId) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: email or priceId" }),
      { status: 400 }
    );
  }

  try {
    const checkoutUrl = await createCheckoutSession(email, priceId); // ✅ pass both args
    return new Response(JSON.stringify({ url: checkoutUrl }), { status: 200 });
  } catch (error) {
    console.error("❌ Checkout creation failed:", error);
    return new Response(JSON.stringify({ error: "Checkout failed" }), { status: 500 });
  }
}
