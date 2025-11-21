/**
 * Category Related Schemas
 */

export const categorySchemas = {
  Category: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Category ID'
      },
      parentId: {
        type: 'integer',
        nullable: true,
        example: null,
        description: 'Parent category ID (null for root categories)'
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

  CategoryCreateRequest: {
    type: 'object',
    properties: {
      parentId: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: 'Parent category ID (optional, must exist if provided)'
      }
    }
  },

  CategoryUpdateRequest: {
    type: 'object',
    properties: {
      parentId: {
        type: 'integer',
        nullable: true,
        example: 2,
        description: 'Parent category ID (must exist, cannot be self)'
      }
    }
  },

  CategoryTranslation: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1
      },
      categoryId: {
        type: 'integer',
        example: 1,
        description: 'Associated category ID'
      },
      storeViewId: {
        type: 'integer',
        example: 1,
        description: 'Associated store view ID'
      },
      name: {
        type: 'string',
        example: 'Electronics',
        description: 'Category name in specific language'
      },
      slug: {
        type: 'string',
        example: 'electronics',
        description: 'URL-friendly slug'
      },
      description: {
        type: 'string',
        nullable: true,
        example: 'All electronic products',
        description: 'Category description'
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

  CategoryTranslationCreateRequest: {
    type: 'object',
    properties: {
      categoryId: {
        type: 'integer',
        example: 1,
        description: 'Category ID (required)'
      },
      storeViewId: {
        type: 'integer',
        example: 1,
        description: 'Store view ID (required)'
      },
      name: {
        type: 'string',
        example: 'Electronics',
        description: 'Category name (optional)'
      },
      slug: {
        type: 'string',
        example: 'electronics',
        description: 'URL slug (optional)'
      },
      description: {
        type: 'string',
        example: 'All electronic products',
        description: 'Category description (optional)'
      }
    },
    required: ['categoryId', 'storeViewId']
  },

  ProductCategory: {
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
      categoryId: {
        type: 'integer',
        example: 1,
        description: 'Associated category ID'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      }
    }
  },

  ProductCategoryCreateRequest: {
    type: 'object',
    properties: {
      productId: {
        type: 'integer',
        example: 1,
        description: 'Product ID (required)'
      },
      categoryId: {
        type: 'integer',
        example: 1,
        description: 'Category ID (required)'
      }
    },
    required: ['productId', 'categoryId']
  }
};

export const categoryParameters = {
  ParentIdParam: {
    name: 'parentId',
    in: 'path',
    required: true,
    schema: {
      type: 'integer',
      minimum: 1
    },
    description: 'Parent category ID'
  },

  ParentIdFilterParam: {
    name: 'parentId',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      minimum: 1
    },
    description: 'Filter by parent category ID'
  }
};
