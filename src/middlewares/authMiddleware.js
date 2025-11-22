/**
 * Authentication Middleware
 * Verifies Clerk authentication tokens and protects API routes
 * 
 * Usage:
 * - Apply to routes that require authentication
 * - Attaches authenticated user info to req.auth
 * - Returns 401 Unauthorized for invalid/missing tokens
 */

import { clerkMiddleware, getAuth} from "@clerk/express";

/**
 * Clerk authentication middleware
 * Automatically verifies JWT tokens from Authorization header
 * Attaches session data to req.auth if valid
 */
export const authMiddleware = clerkMiddleware();

/**
 * Require authentication middleware
 * Use this on protected routes to enforce authentication
 * Returns 401 if user is not authenticated
 */
export const requireAuthentication = (req, res, next) => {
  // Check if user is authenticated via Clerk
  const { userId } = getAuth(req)
  if (!userId) {
    return res.unauthorized("Authentication required. Please provide a valid authentication token.");
  }
  
  next();
};

/**
 * Optional authentication middleware
 * Allows requests through but populates req.auth if token exists
 * Use for routes that work with or without authentication
 */
export const optionalAuth = (req, res, next) => {
  // Continue regardless of authentication status
  // req.auth will be populated if valid token exists
  next();
};
