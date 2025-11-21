/**
 * Standard Response Schemas
 * Based on responseHelper.js middleware
 */

export const responses = {
  SuccessResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
        description: 'Indicates successful operation'
      },
      statusCode: {
        type: 'integer',
        example: 200,
        description: 'HTTP status code'
      },
      message: {
        type: 'string',
        example: 'Operation completed successfully',
        description: 'Success message'
      },
      data: {
        type: 'object',
        description: 'Response data payload'
      },
      meta: {
        type: 'object',
        description: 'Optional metadata (pagination, etc.)',
        properties: {
          total: {
            type: 'integer',
            example: 100,
            description: 'Total number of items'
          },
          page: {
            type: 'integer',
            example: 1,
            description: 'Current page number'
          },
          limit: {
            type: 'integer',
            example: 10,
            description: 'Items per page'
          },
          totalPages: {
            type: 'integer',
            example: 10,
            description: 'Total number of pages'
          }
        }
      }
    },
    required: ['success', 'statusCode', 'message']
  },

  CreatedResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
        description: 'Indicates successful creation'
      },
      statusCode: {
        type: 'integer',
        example: 201,
        description: 'HTTP status code'
      },
      message: {
        type: 'string',
        example: 'Resource created successfully',
        description: 'Success message'
      },
      data: {
        type: 'object',
        description: 'Created resource data'
      }
    },
    required: ['success', 'statusCode', 'message', 'data']
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
        description: 'Indicates operation failure'
      },
      statusCode: {
        type: 'integer',
        example: 500,
        description: 'HTTP status code'
      },
      message: {
        type: 'string',
        example: 'An error occurred',
        description: 'Error message'
      },
      error: {
        type: 'object',
        description: 'Optional error details',
        additionalProperties: true
      }
    },
    required: ['success', 'statusCode', 'message']
  },

  NotFoundResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
        description: 'Indicates resource not found'
      },
      statusCode: {
        type: 'integer',
        example: 404,
        description: 'HTTP status code'
      },
      message: {
        type: 'string',
        example: 'Resource not found',
        description: 'Not found message'
      }
    },
    required: ['success', 'statusCode', 'message']
  },

  BadRequestResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
        description: 'Indicates bad request'
      },
      statusCode: {
        type: 'integer',
        example: 400,
        description: 'HTTP status code'
      },
      message: {
        type: 'string',
        example: 'Bad request',
        description: 'Validation or request error message'
      },
      error: {
        type: 'object',
        description: 'Optional validation error details',
        additionalProperties: true
      }
    },
    required: ['success', 'statusCode', 'message']
  },

  UnauthorizedResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
        description: 'Indicates unauthorized access'
      },
      statusCode: {
        type: 'integer',
        example: 401,
        description: 'HTTP status code'
      },
      message: {
        type: 'string',
        example: 'Unauthorized',
        description: 'Unauthorized message'
      }
    },
    required: ['success', 'statusCode', 'message']
  }
};
