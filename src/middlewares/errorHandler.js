import { Prisma } from "@prisma/client";

const createErrorResponse = (message, statusCode, error = null) => {
  return {
    success: false,
    statusCode,
    message,
    ...(error && { error }),
  };
};

export const errorHandler = (err, req, res, next) => {
  console.log(err)
  // Database errors handling
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(400).json(
          createErrorResponse("This record already exists.", 400, {
            name: "DuplicateError",
            message: "The provided data conflicts with existing records",
          })
        );
      case "P2003":
        return res.status(400).json(
          createErrorResponse("Referenced record does not exist.", 400, {
            name: "ReferenceError",
            message: "The referenced record does not exist in the system",
          })
        );
      case "P2025":
        return res.status(404).json(
          createErrorResponse("Record not found.", 404, {
            name: "NotFoundError",
            message: "The requested record could not be found",
          })
        );
      default:
        return res.status(400).json(
          createErrorResponse("Invalid operation.", 400, {
            name: "OperationError",
            message: "The requested operation could not be performed",
          })
        );
    }
  }

  // Validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json(
      createErrorResponse("Invalid input data.", 400, {
        name: "ValidationError",
        message: "The provided data format is invalid",
      })
    );
  }

  // Unexpected database errors
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(500).json(
      createErrorResponse("An internal error occurred.", 500, {
        name: "ServerError",
        message: "An unexpected error occurred while processing your request",
      })
    );
  }

  // Custom validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json(
      createErrorResponse("Validation failed.", 400, {
        name: "ValidationError",
        message: err.errors,
      })
    );
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json(
      createErrorResponse("Invalid authentication token.", 401, {
        name: "AuthenticationError",
        message: "The provided authentication token is invalid",
      })
    );
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json(
      createErrorResponse("Authentication token expired.", 401, {
        name: "AuthenticationError",
        message: "The authentication token has expired, please login again",
      })
    );
  }

  // Default error
  return res.status(500).json(
    createErrorResponse("An unexpected error occurred.", 500, {
      name: "ServerError",
      message: "An internal server error occurred",
    })
  );
};
