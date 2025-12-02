import crypto from "crypto";

/**
 * Generate a secure random token for workspace invitations
 * @param {number} length - Length of the token in bytes (default: 32)
 * @returns {string} - Hexadecimal token string
 */
export const generateInvitationToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

/**
 * Calculate expiration date from current time
 * @param {number} hours - Number of hours until expiration (default: 168 = 7 days)
 * @returns {Date} - Expiration date
 */
export const calculateExpirationDate = (hours = 168) => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + hours);
  return expiresAt;
};

/**
 * Check if a date is expired
 * @param {Date} expirationDate - The expiration date to check
 * @returns {boolean} - True if expired, false otherwise
 */
export const isTokenExpired = (expirationDate) => {
  return new Date() > new Date(expirationDate);
};
