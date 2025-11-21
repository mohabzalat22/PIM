/**
 * Common Reusable Schemas
 * Shared components used across multiple endpoints
 */

export const common = {
  // Pagination metadata
  PaginationMeta: {
    type: 'object',
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
    },
    required: ['total', 'page', 'limit', 'totalPages']
  },

  // Timestamps
  Timestamps: {
    type: 'object',
    properties: {
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-11-21T10:00:00.000Z',
        description: 'Resource creation timestamp'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-11-21T12:00:00.000Z',
        description: 'Resource last update timestamp'
      }
    }
  },

  // Enums
  ProductType: {
    type: 'string',
    enum: ['SIMPLE', 'CONFIGURABLE', 'BUNDLE', 'VIRTUAL', 'DOWNLOADABLE'],
    description: 'Product type classification'
  },

  AttributeDataType: {
    type: 'string',
    enum: ['BOOLEAN', 'STRING', 'INT', 'DECIMAL', 'TEXT', 'JSON'],
    description: 'Data type for attribute values'
  },

  AttributeInputType: {
    type: 'string',
    enum: ['TEXT', 'SELECT', 'MULTISELECT', 'DATE', 'MEDIA'],
    description: 'Input type for attribute in UI'
  },

  AssetType: {
    type: 'string',
    enum: ['image', 'video', 'pdf', 'manual'],
    description: 'Asset type classification'
  }
};

export const parameters = {
  // Common path parameters
  IdParam: {
    name: 'id',
    in: 'path',
    required: true,
    schema: {
      type: 'integer',
      minimum: 1
    },
    description: 'Resource ID'
  },

  // Common query parameters
  PageParam: {
    name: 'page',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      default: 1,
      minimum: 1
    },
    description: 'Page number for pagination'
  },

  LimitParam: {
    name: 'limit',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      default: 10,
      minimum: 1,
      maximum: 100
    },
    description: 'Number of items per page'
  },

  SearchParam: {
    name: 'search',
    in: 'query',
    required: false,
    schema: {
      type: 'string'
    },
    description: 'Search query string'
  },

  SortByParam: {
    name: 'sortBy',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      default: 'createdAt'
    },
    description: 'Field to sort by'
  },

  SortOrderParam: {
    name: 'sortOrder',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['asc', 'desc'],
      default: 'desc'
    },
    description: 'Sort order (ascending or descending)'
  }
};
