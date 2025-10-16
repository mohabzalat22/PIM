import { Prisma } from "@prisma/client";
import { errorMessage } from "../utils/message.js";

export const errorHandler = (err, req, res, next) => {
  // Handle Prisma-specific errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint failed
    if (err.code === "P2002") {
      return res
        .status(400)
        .json(
          errorMessage(
            `Unique constraint failed on: ${err.meta.target.join(", ")}`,
            400,
            err
          )
        );
    }
    // Foreign key constraint failed
    if (err.code === "P2003") {
      return res
        .status(400)
        .json(
          errorMessage(
            "Foreign key constraint failed. Related record not found.",
            400,
            err
          )
        );
    }
    // Record not found
    if (err.code === "P2025") {
      return res.status(404).json(errorMessage("Record not found.", 404, err));
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res
      .status(400)
      .json(errorMessage("Invalid input data format.", 400, err));
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res
      .status(500)
      .json(errorMessage("Internal database error occurred.", 500, err));
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json(errorMessage("Validation failed.", 400, err.errors));
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json(errorMessage("Invalid token.", 401, err));
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json(errorMessage("Token expired.", 401, err));
  }

  // Default error response
  return res
    .status(500)
    .json(errorMessage(err.message || "Something went wrong", 500, err));
};
