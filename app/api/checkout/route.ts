import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

// Subscription price IDs
const SUBSCRIPTION_PRICES: Record<string, string> = {
  standard: process.env.STRIPE_PRICE_STANDARD!,
  premium: process.env.STRIPE_PRICE_PREMIUM!,
  featured: process.env.STRIPE_PRICE_FEATURED!,
  pro_host: process.env.STRIPE_PRICE_PRO_HOST!,
  property_manager: process.env.STRIPE_PRICE_PROPERTY_MANAGER!,
};

// One-time product price IDs
const ONE_TIME_PRICES: Record<string, string> = {
  featured_boost: process.env.STRIPE_PRICE_FEATURED_BOOST!,
  verification_badge: process.env.STRIPE_PRICE_VERIFICATION_BADGE!,
};

export async function POST(request: Request) {
  try {
    const { tier, email } = await request.json();

    let mode: "subscription" | "payment";
    let priceId: string | undefined;

    if (SUBSCRIPTION_PRICES[tier]) {
      mode = "subscription";
      priceId = SUBSCRIPTION_PRICES[tier];
    } else if (ONE_TIME_PRICES[tier]) {
      mode = "payment";
      priceId = ONE_TIME_PRICES[tier];
    } else {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode,
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: { tier },
      ...(mode === "subscription" ? { managed_payments: { enabled: false } } : {}),
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
