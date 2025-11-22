import z from "zod";
import { findById, findByEmail } from "../models/userModel.js";

const userSchema = z.object({
  name: z.string().min(1, "User name is required"),
  email: z.string().email("Invalid email format").min(1, "User email is required"),
});

const userUpdateSchema = z.object({
  name: z.string().min(1, "User name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const validateUserCreation = async (req, res, next) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("User validation failed. Please check the provided data.", result.error);
  }

  // Check if a user with the same email already exists
  const userExists = await findByEmail(result.data.email);

  if (userExists) {
    return res.error(`A user with email '${result.data.email}' already exists in the system.`, 409, {
      error: `email-${result.data.email}`,
    });
  }

  next();
};

export const validateUserUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("User ID is required and must be a valid number.");
  }

  const result = userUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.badRequest("User update validation failed. Please check the provided data.", result.error);
  }

  const userExists = await findById(id);

  if (!userExists) {
    return res.notFound(`User with ID ${id} not found.`);
  }

  // If email is being updated, check for uniqueness
  if (result.data.email) {
    const emailExists = await findByEmail(result.data.email);
    if (emailExists && emailExists.id !== id) {
      return res.error(`A user with email '${result.data.email}' already exists in the system.`, 409, {
        error: `email-${result.data.email}`,
      });
    }
  }

  next();
};
