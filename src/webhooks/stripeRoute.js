import express from "express";
import stripeWebhook from "./stripe.webhook.js";
const router = express.Router();

// Use express.raw with specific configuration for Stripe
router.post("/", 
  express.raw({ 
    type: 'application/json',
    limit: '1mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }), 
  stripeWebhook
);

export default router;