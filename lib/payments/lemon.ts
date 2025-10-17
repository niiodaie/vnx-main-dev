// lib/payments/lemon.ts
export async function createLemonCheckout(email: string, priceId: string) {
  try {
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            product_id: priceId,
            email,
          },
        },
      }),
    });

    const json = await response.json();
    return json.data.attributes.url;
  } catch (err) {
    console.error("❌ Lemon checkout failed:", err);
    throw new Error("Lemon checkout failed");
  }
}
