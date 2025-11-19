# Response Structure Rules

This document defines the standard response structure for all backend API endpoints based on the utility functions in `/src/utils/message.js`.

## Response Format

All API responses must follow a consistent structure to ensure predictable client-side handling.

### Success Response

```javascript
{
  success: true,
  statusCode: 200,  // HTTP status code (200, 201, etc.)
  message: "Success",  // Human-readable success message
  data: {...},  // The actual response data
  meta: {...}  // Optional metadata (pagination, etc.)
}
```

### Error Response

```javascript
{
  success: false,
  statusCode: 500,  // HTTP status code (400, 404, 500, etc.)
  message: "An error occurred",  // Human-readable error message
  error: {...}  // Optional error details
}
```

## Implementation Guidelines

### 1. Using the Utility Functions

Always use the provided utility functions from `/src/utils/message.js`:

```javascript
import { successMessage, errorMessage } from '../utils/message.js';
```

### 2. Success Response Examples

**Basic success response:**
```javascript
return res.status(200).json(
  successMessage(
    product,
    200,
    "Product retrieved successfully"
  )
);
```

**Success with metadata (pagination):**
```javascript
return res.status(200).json(
  successMessage(
    products,
    200,
    "Products retrieved successfully",
    {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10
    }
  )
);
```

**Creation success:**
```javascript
return res.status(201).json(
  successMessage(
    newProduct,
    201,
    "Product created successfully"
  )
);
```

### 3. Error Response Examples

**Validation error:**
```javascript
return res.status(400).json(
  errorMessage(
    "Validation failed",
    400,
    validationErrors
  )
);
```

**Not found error:**
```javascript
return res.status(404).json(
  errorMessage(
    "Product not found",
    404
  )
);
```

**Server error:**
```javascript
return res.status(500).json(
  errorMessage(
    "Failed to create product",
    500,
    error.message
  )
);
```

### 4. Controller Pattern

All controllers should follow this pattern:

```javascript
export const getProducts = async (req, res) => {
  try {
    // Business logic
    const products = await ProductModel.getAllProducts();
    
    // Success response
    return res.status(200).json(
      successMessage(
        products,
        200,
        "Products retrieved successfully"
      )
    );
  } catch (error) {
    // Error response
    return res.status(500).json(
      errorMessage(
        "Failed to retrieve products",
        500,
        error.message
      )
    );
  }
};
```

### 5. Status Code Guidelines

**Success codes:**
- `200` - OK (GET, PUT, DELETE)
- `201` - Created (POST)
- `204` - No Content (DELETE with no response body)

**Client error codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)

**Server error codes:**
- `500` - Internal Server Error (unexpected errors)
- `503` - Service Unavailable (temporary issues)

### 6. Required Fields

**Every success response MUST include:**
- `success: true`
- `statusCode` - matching the HTTP status code
- `message` - descriptive success message
- `data` - the actual response payload

**Every error response MUST include:**
- `success: false`
- `statusCode` - matching the HTTP status code
- `message` - descriptive error message

**Optional fields:**
- `meta` - for pagination, filtering info, etc. (success only)
- `error` - for detailed error information (error only)

### 7. Pagination Metadata Structure

When returning paginated results, always include meta information:

```javascript
{
  success: true,
  statusCode: 200,
  message: "Products retrieved successfully",
  data: [...],
  meta: {
    total: 100,      // Total number of records
    page: 1,         // Current page number
    limit: 10,       // Items per page
    totalPages: 10   // Total number of pages
  }
}
```

### 8. Common Mistakes to Avoid

❌ **Don't** return inconsistent response structures:
```javascript
// BAD
return res.json({ product });
return res.json({ error: "Failed" });
```

✅ **Do** always use the utility functions:
```javascript
// GOOD
return res.status(200).json(successMessage(product, 200, "Product retrieved"));
return res.status(500).json(errorMessage("Failed to retrieve product", 500));
```

❌ **Don't** forget to set the HTTP status code:
```javascript
// BAD
return res.json(successMessage(data, 200, "Success"));
```

✅ **Do** always set the status code on the response:
```javascript
// GOOD
return res.status(200).json(successMessage(data, 200, "Success"));
```

❌ **Don't** expose sensitive error details in production:
```javascript
// BAD
return res.status(500).json(errorMessage("Error", 500, error.stack));
```

✅ **Do** provide safe error messages:
```javascript
// GOOD
return res.status(500).json(
  errorMessage(
    "Failed to process request",
    500,
    process.env.NODE_ENV === 'development' ? error.message : null
  )
);
```

### 9. TypeScript/JSDoc Type Definitions

For better IDE support, consider adding JSDoc comments:

```javascript
/**
 * @typedef {Object} SuccessResponse
 * @property {boolean} success - Always true for success responses
 * @property {number} statusCode - HTTP status code
 * @property {string} message - Success message
 * @property {*} data - Response data
 * @property {Object} [meta] - Optional metadata
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false for error responses
 * @property {number} statusCode - HTTP status code
 * @property {string} message - Error message
 * @property {*} [error] - Optional error details
 */
```

---

## Quick Reference

**Import:**
```javascript
import { successMessage, errorMessage } from '../utils/message.js';
```

**Success:**
```javascript
res.status(200).json(successMessage(data, 200, "Success message"));
```

**Error:**
```javascript
res.status(500).json(errorMessage("Error message", 500, errorDetails));
```
