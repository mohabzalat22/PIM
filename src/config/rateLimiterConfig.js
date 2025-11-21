import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: +process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000, // 10 minutes
  max: +process.env.RATE_LIMIT_MAX_REQUESTS || 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
  message: "Too many requests from this IP, please try again after 10 minutes",
});

export default limiter;