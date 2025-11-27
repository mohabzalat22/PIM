import { Router } from "express";
import SubscriptionService from "../services/subscription.service.js";
import UserService from "../services/user.service.js";
import { getAuth } from "@clerk/express";
import { findByUserId } from "../models/subscriptionModel.js";
import Stripe from "stripe";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get current user's subscription status
router.get("/subscription-status", async (req, res) => {
  const clerkUser = getAuth(req);
  const user = await UserService.getUserByClerkId(clerkUser.userId);

  if (!user) {
    return res.unauthorized("User not authenticated");
  }

  const subscription = await findByUserId(user.id);

  if (!subscription) {
    return res.success(null, "No subscription found");
  }

  res.success(subscription, "Subscription retrieved successfully");
});

// Create billing portal session
router.post("/create-portal-session", async (req, res) => {
  const clerkUser = getAuth(req);
  const user = await UserService.getUserByClerkId(clerkUser.userId);

  if (!user) {
    return res.unauthorized("User not authenticated");
  }

  if (!user.stripeCustomerId) {
    return res.badRequest("No Stripe customer found");
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url:
        process.env.FRONTEND_URL + "/settings" ||
        "http://localhost:5173/settings",
    });

    res.success({ url: session.url }, "Portal session created");
  } catch (error) {
    return res.error("Failed to create portal session", error.message);
  }
});

// Create checkout session
router.post("/", async (req, res) => {
  const clerkUser = getAuth(req);
  const user = await UserService.getUserByClerkId(clerkUser.userId);
  const { priceId } = req.body;

  if (!user) {
    return res.unauthorized("User not authenticated");
  }
  if (!priceId) {
    return res.badRequest("Price ID is required");
  }

  // Check if user already has an active subscription
  const existingSubscription = await findByUserId(user.id);
  if (existingSubscription && existingSubscription.status === "ACTIVE") {
    return res.badRequest(
      "You already have an active subscription. Please cancel your current subscription before purchasing a new one."
    );
  }

  // create subscribtion checkout session
  const checkoutSession = await SubscriptionService.createCheckoutSession(
    user,
    priceId
  );
  res.success(checkoutSession, "Checkout session created");
});

export default router;
