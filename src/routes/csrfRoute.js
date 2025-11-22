import express from "express";
import { csrfMiddleware } from "../middlewares/csrfMiddleware.js";

const router = express.Router();

router.get("/csrf-token", csrfMiddleware, (req, res) => {
  const csrfToken = res.locals.csrfToken;
  res.json({ csrfToken });
});

export default router;
