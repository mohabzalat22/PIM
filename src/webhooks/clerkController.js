import {
  create,
  update,
  deleteById,
  findByClerkId,
  findByEmail,
} from "../models/userModel.js";

import CustomerService from "../services/customer.service.js";

/**
 * Clerk Webhook Controller
 * Handles webhook events from Clerk to sync user data
 * 
 * Supported events:
 * - user.created: Create new user in database
 * - user.updated: Update existing user data
 * - user.deleted: Delete user from database
 */
const clerkController = async (req, res) => {
    const { type, data } = req.body;
    // Handle different Clerk webhook event types
    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        return res.success(null, "User created successfully");

      case "user.updated":
        await handleUserUpdated(data);
        return res.success(null, "User updated successfully");

      case "user.deleted":
        await handleUserDeleted(data);
        return res.success(null, "User deleted successfully");

      default:
        console.log(`[Clerk Webhook] Unhandled event type: ${type}`);
        return res.success(null, "Webhook received but not processed");
    }
};

/**
 * Handle user.created event
 * Creates a new user in the database with data from Clerk
 */
const handleUserCreated = async (userData) => {
  const { id: clerkId, email_addresses, first_name, last_name, username } = userData;

  // Get primary email address
  const primaryEmail = email_addresses?.find((email) => email.id === userData.primary_email_address_id);
  const email = primaryEmail?.email_address;

  if (!email) {
    throw new Error("No email address found in Clerk user data");
  }

  // Construct full name - prioritize first/last name, then username, then email prefix
  const fullName = `${first_name || ""} ${last_name || ""}`.trim();
  const name = fullName || username || email.split("@")[0];

  // Check if user already exists
  const existingUser = await findByClerkId(clerkId);
  if (existingUser) {
    return existingUser;
  }

  // Check if email is already in use
  const existingEmailUser = await findByEmail(email);
  if (existingEmailUser) {
    // Update existing user with Clerk ID
    return await update(existingEmailUser.id, { clerkId, name });
  }

  // Create new user
  const stripeCustomer = await CustomerService.create({ email, name });
  const newUser = await create({
    clerkId,
    stripeCustomerId: stripeCustomer.id,
    email,
    name,
  });
  // Update user with Stripe customer ID
  return newUser;
};

/**
 * Handle user.updated event
 * Updates existing user data in the database
 */
const handleUserUpdated = async (userData) => {
  const { id: clerkId, email_addresses, first_name, last_name, username } = userData;

  // Find user by Clerk ID
  const existingUser = await findByClerkId(clerkId);
  if (!existingUser) {
    return await handleUserCreated(userData);
  }

  // Get primary email address
  const primaryEmail = email_addresses?.find((email) => email.id === userData.primary_email_address_id);
  const email = primaryEmail?.email_address;

  // Construct full name - prioritize first/last name, then username, then email prefix, then existing name
  const fullName = `${first_name || ""} ${last_name || ""}`.trim();
  const name = fullName || username || email?.split("@")[0] || existingUser.name;

  // Prepare update data
  const updateData = {
    name,
  };

  // Only update email if it's different and provided
  if (email && email !== existingUser.email) {
    updateData.email = email;
  }

  // Update user
  const updatedUser = await update(existingUser.id, updateData);

  return updatedUser;
};

/**
 * Handle user.deleted event
 * Deletes user from the database
 */
const handleUserDeleted = async (userData) => {
  const { id: clerkId } = userData;

  // Find user by Clerk ID
  const existingUser = await findByClerkId(clerkId);
  if (!existingUser) {
    return null;
  }

  // Delete user (this will cascade delete team memberships)
  const deletedUser = await deleteById(existingUser.id);
  
  return deletedUser;
};

export default clerkController;