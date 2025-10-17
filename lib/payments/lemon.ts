 /**
 * ✅ LemonSqueezy Checkout Handler
 * Used when NEXT_PUBLIC_USE_STRIPE !== "true"
 */
export async function createLemonCheckout(email: string, priceId: string) {
  const storeUrl = process.env.NEXT_PUBLIC_LEMON_STORE_URL || "https://store.lemonsqueezy.com";
  const productUrl = `${storeUrl}/checkout/buy/${priceId}?email=${encodeURIComponent(email)}`;
  return productUrl;
}
