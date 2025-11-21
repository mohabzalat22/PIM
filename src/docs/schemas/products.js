/**
 * Product Related Schemas
 */

export const productSchemas = {
  Product: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Product ID'
      },
      sku: {
        type: 'string',
        example: 'PROD-001',
        description: 'Unique product SKU'
      },
      type: {
        type: 'string',
        enum: ['SIMPLE', 'CONFIGURABLE', 'BUNDLE', 'VIRTUAL', 'DOWNLOADABLE'],
        example: 'SIMPLE',
        description: 'Product type'
      },
      attributeSetId: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: 'Associated attribute set ID'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-11-21T10:00:00.000Z'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-11-21T12:00:00.000Z'
      }
    },
    required: ['id', 'sku', 'type']
  },

  ProductCreateRequest: {
    type: 'object',
    properties: {
      sku: {
        type: 'string',
        example: 'PROD-001',
        description: 'Unique product SKU (required, must be unique)'
      },
      type: {
        type: 'string',
        enum: ['SIMPLE', 'CONFIGURABLE', 'BUNDLE', 'VIRTUAL', 'DOWNLOADABLE'],
        example: 'SIMPLE',
        description: 'Product type (required)'
      },
      attributeSetId: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: 'Associated attribute set ID (optional)'
      }
    },
    required: ['sku', 'type']
  },

  ProductUpdateRequest: {
    type: 'object',
    properties: {
      sku: {
        type: 'string',
        example: 'PROD-001-UPDATED',
        description: 'Product SKU (must be unique if provided)'
      },
      type: {
        type: 'string',
        enum: ['SIMPLE', 'CONFIGURABLE', 'BUNDLE', 'VIRTUAL', 'DOWNLOADABLE'],
        example: 'CONFIGURABLE',
        description: 'Product type'
      },
      attributeSetId: {
        type: 'integer',
        nullable: true,
        example: 2,
        description: 'Associated attribute set ID'
      }
    }
  },

  ProductListResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      statusCode: {
        type: 'integer',
        example: 200
      },
      message: {
        type: 'string',
        example: 'Products retrieved successfully'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Product'
        }
      },
      meta: {
        $ref: '#/components/schemas/PaginationMeta'
      }
    }
  },

  ProductDetailResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      statusCode: {
        type: 'integer',
        example: 200
      },
      message: {
        type: 'string',
        example: 'Product retrieved successfully'
      },
      data: {
        $ref: '#/components/schemas/Product'
      }
    }
  }
};

export const productParameters = {
  TypeFilterParam: {
    name: 'type',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['SIMPLE', 'CONFIGURABLE', 'BUNDLE', 'VIRTUAL', 'DOWNLOADABLE']
    },
    description: 'Filter products by type'
  },

  CategoryIdParam: {
    name: 'categoryId',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      minimum: 1
    },
    description: 'Filter products by category ID'
  },

  AttributesFilterParam: {
    name: 'attributes',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      example: '{"color":"red","size":"large"}'
    },
    description: 'Filter products by attribute values (JSON string)'
  }
};
