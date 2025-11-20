import express from "express";
const router = express.Router();

router.get("/csrf-token", (req, res) => {
  const csrfToken = res.locals.csrfToken;
  res.json({ csrfToken });
});

export default router;
