import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function createLemonCheckout(userEmail: string) {
  const checkout = await createCheckout({
    product_id: process.env.LEMONSQUEEZY_PRODUCT_ID_PRO!,
    email: userEmail,
    store_id: process.env.LEMONSQUEEZY_STORE_ID!,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/netscan/cancel`,
  });

  return checkout?.data?.data?.attributes?.urls?.checkout_url;
}
