import csrf from "csrf";

const tokens = new csrf();

export function csrfMiddleware(req, res, next) {
  const methodsToProtect = ["POST", "PUT", "PATCH", "DELETE"];

  let secret = req.cookies["csrf-secret"];

  if (!secret) {
    secret = tokens.secretSync();

    res.cookie("csrf-secret", secret, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/"
    });
  }

  res.locals.csrfToken = tokens.create(secret);

  if (methodsToProtect.includes(req.method)) {
    const token =
      req.headers["csrf-token"] ||
      req.body._csrf ||
      req.query._csrf;

    if (!token || !tokens.verify(secret, token)) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
  }

  next();
}
