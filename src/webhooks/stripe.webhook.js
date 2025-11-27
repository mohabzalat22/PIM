import Stripe from "stripe";
import UserService from "../services/user.service.js";
import SubscriptionService from "../services/subscription.service.js";
import {
  create,
  findByUserId,
  findByStripeId,
  update,
} from "../models/subscriptionModel.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const payload = req.body;

  if (!payload) {
    return res.badRequest("No webhook payload received");
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      const user = await UserService.getUserByStripeCustomerId(customerId);
      if (!user) break;

      const data = {
        userId: parseInt(user.id),
        stripeSubscriptionId: subscriptionId,
        plan: "basic",
      };

      let subscription = await findByUserId(user.id);
      if (!subscription) {
        asyncWrapper(
          await create(data)
        )
      }
      subscription = await findByUserId(user.id);
      await SubscriptionService.activateSubscription(
        subscription.id,
        subscriptionId,
        user.clerkId
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const stripeSubscriptionId = subscription.id;
      const dbSubscription = await findByStripeId(stripeSubscriptionId);

      if (dbSubscription) {
        await update(dbSubscription.id, { status: "CANCELED" });
      }
      break;
    }
  }

  res.success({ received: true }, "Event Received Successfully");
};

export default stripeWebhook;
