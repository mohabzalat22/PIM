/**
 * Asset Related Schemas
 */

export const assetSchemas = {
  Asset: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Asset ID'
      },
      filePath: {
        type: 'string',
        example: '/uploads/images/product-image.jpg',
        description: 'File path or URL'
      },
      mimeType: {
        type: 'string',
        example: 'image/jpeg',
        description: 'MIME type of the asset'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time'
      }
    }
  },

  AssetCreateRequest: {
    type: 'object',
    properties: {
      filePath: {
        type: 'string',
        example: '/uploads/images/product-image.jpg',
        description: 'File path or URL (required)'
      },
      mimeType: {
        type: 'string',
        example: 'image/jpeg',
        description: 'MIME type (required)'
      }
    },
    required: ['filePath', 'mimeType']
  },

  ProductAsset: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1
      },
      productId: {
        type: 'integer',
        example: 1,
        description: 'Associated product ID'
      },
      assetId: {
        type: 'integer',
        example: 1,
        description: 'Associated asset ID'
      },
      position: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: 'Display position/order'
      },
      type: {
        type: 'string',
        example: 'image',
        description: 'Asset type (image, video, pdf, manual)'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      }
    }
  },

  ProductAssetCreateRequest: {
    type: 'object',
    properties: {
      productId: {
        type: 'integer',
        example: 1,
        description: 'Product ID (required)'
      },
      assetId: {
        type: 'integer',
        example: 1,
        description: 'Asset ID (required)'
      },
      position: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: 'Display position (optional)'
      },
      type: {
        type: 'string',
        example: 'image',
        description: 'Asset type: image, video, pdf, manual (required)'
      }
    },
    required: ['productId', 'assetId', 'type']
  },

  Analytics: {
    type: 'object',
    properties: {
      totalProducts: {
        type: 'integer',
        example: 150,
        description: 'Total number of products'
      },
      totalCategories: {
        type: 'integer',
        example: 25,
        description: 'Total number of categories'
      },
      totalAttributes: {
        type: 'integer',
        example: 42,
        description: 'Total number of attributes'
      },
      totalAssets: {
        type: 'integer',
        example: 300,
        description: 'Total number of assets'
      },
      productsByType: {
        type: 'object',
        example: {
          SIMPLE: 100,
          CONFIGURABLE: 30,
          BUNDLE: 10,
          VIRTUAL: 5,
          DOWNLOADABLE: 5
        },
        description: 'Product count by type'
      },
      recentActivity: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'product_created' },
            timestamp: { type: 'string', format: 'date-time' },
            data: { type: 'object' }
          }
        },
        description: 'Recent system activity'
      }
    }
  },

  CSRFToken: {
    type: 'object',
    properties: {
      csrfToken: {
        type: 'string',
        example: 'a1b2c3d4e5f6g7h8i9j0',
        description: 'CSRF token for form submissions'
      }
    }
  }
};
