import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

const PRICE_MAP: Record<string, string> = {
  standard: process.env.STRIPE_PRICE_STANDARD!,
  premium: process.env.STRIPE_PRICE_PREMIUM!,
  featured: process.env.STRIPE_PRICE_FEATURED!,
  pro_host: process.env.STRIPE_PRICE_PRO_HOST!,
  property_manager: process.env.STRIPE_PRICE_PROPERTY_MANAGER!,
};

export async function POST(request: Request) {
  try {
    const { tier, email } = await request.json();

    const priceId = PRICE_MAP[tier];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: { tier },
      managed_payments: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
