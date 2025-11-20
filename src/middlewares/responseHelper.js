/**
 * Response Helper Middleware
 * Extends Express response object with standardized response methods
 * 
 * Available methods:
 * - res.success(data, message, meta) - 200 OK
 * - res.created(data, message) - 201 Created
 * - res.error(message, statusCode, error) - 500 or custom
 * - res.notFound(message) - 404 Not Found
 * - res.unauthorized(message) - 401 Unauthorized
 * - res.badRequest(message, error) - 400 Bad Request
 */

export const responseHelper = (req, res, next) => {
  /**
   * Success response (200 OK)
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {object} meta - Optional metadata (pagination, etc.)
   */
  res.success = (data = null, message = "Success", meta = null) => {
    const response = {
      success: true,
      statusCode: 200,
      message,
      data,
    };

    // Only add meta if it exists
    if (meta) {
      response.meta = meta;
    }

    return res.status(200).json(response);
  };

  /**
   * Created response (201 Created)
   * @param {*} data - Created resource data
   * @param {string} message - Success message
   */
  res.created = (data = null, message = "Created successfully") => {
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message,
      data,
    });
  };

  /**
   * Error response (500 or custom status code)
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {*} error - Error details
   */
  res.error = (message = "An error occurred", statusCode = 500, error = null) => {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error,
    });
  };

  /**
   * Not Found response (404)
   * @param {string} message - Not found message
   */
  res.notFound = (message = "Resource not found") => {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message,
    });
  };

  /**
   * Unauthorized response (401)
   * @param {string} message - Unauthorized message
   */
  res.unauthorized = (message = "Unauthorized") => {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message,
    });
  };

  /**
   * Bad Request response (400)
   * @param {string} message - Bad request message
   * @param {*} error - Error details
   */
  res.badRequest = (message = "Bad request", error = null) => {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message,
      error,
    });
  };

  next();
};
