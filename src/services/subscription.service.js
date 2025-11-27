import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { update, removeByStripeId } from "../models/subscriptionModel.js";

const SubscriptionService = {
  async createCheckoutSession(user, priceId) {
    const successUrl =
      process.env.FRONTEND_URL + "/success" || "http://localhost:5173/success";
    const cancelUrl =
      process.env.FRONTEND_URL + "/cancel" || "http://localhost:5173/cancel";

    if (!user.stripeCustomerId) {
      throw new Error("User has no Stripe customer created");
    }
    if (!priceId) {
      throw new Error("Price ID is required to create checkout session");
    }
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return session;
  },

  async activateSubscription(id, stripeSubscriptionId, clerkId) {
    const stripeSubscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );

    if (!stripeSubscription || stripeSubscription.status !== "active") {
      throw new Error("Stripe subscription is not active");
    }

    const subscription = await update(id, {
      stripeSubscriptionId: stripeSubscriptionId,
      status: "ACTIVE",
      user: {
        connect: { clerkId: clerkId },
      },
    });
    return subscription;
  },
};

export default SubscriptionService;
