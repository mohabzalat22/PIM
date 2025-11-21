/**
 * Swagger API Documentation Configuration
 * XStore Product Information Management System
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { responses } from './schemas/responses.js';
import { common, parameters } from './schemas/common.js';
import { productSchemas, productParameters } from './schemas/products.js';
import { attributeSchemas, attributeParameters } from './schemas/attributes.js';
import { categorySchemas, categoryParameters } from './schemas/categories.js';
import { storeSchemas, storeParameters } from './schemas/stores.js';
import { assetSchemas } from './schemas/assets.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'XStore PIM API',
    version: '1.0.0',
    description: `
      **Product Information Management System API**
      
      Comprehensive API for managing products, categories, attributes, and multi-store configurations.
      
      ## Features
      - Product management with EAV (Entity-Attribute-Value) system
      - Flexible attribute sets and groups
      - Hierarchical category structure
      - Multi-store and multi-language support
      - Asset management
      - Advanced filtering and pagination
      
      ## Response Format
      All responses follow a consistent structure with status codes and messages.
    `,
    contact: {
      name: 'API Support',
      email: 'support@xstore.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Security', description: 'Security and authentication operations' },
    { name: 'Products', description: 'Product management operations' },
    { name: 'Attributes', description: 'Attribute management operations' },
    { name: 'Attribute Sets', description: 'Attribute set management operations' },
    { name: 'Attribute Groups', description: 'Attribute group management operations' },
    { name: 'Product Attributes', description: 'Product attribute value operations' },
    { name: 'Categories', description: 'Category management operations' },
    { name: 'Category Translations', description: 'Category translation operations' },
    { name: 'Product Categories', description: 'Product-category association operations' },
    { name: 'Assets', description: 'Asset management operations' },
    { name: 'Product Assets', description: 'Product-asset association operations' },
    { name: 'Stores', description: 'Store management operations' },
    { name: 'Store Views', description: 'Store view management operations' },
    { name: 'Locales', description: 'Locale management operations' },
    { name: 'Analytics', description: 'Analytics and reporting operations' }
  ],
  security: [
    {
      csrfToken: []
    }
  ],
  components: {
    schemas: {
      // Response schemas
      ...responses,
      // Common schemas
      ...common,
      // Entity schemas
      ...productSchemas,
      ...attributeSchemas,
      ...categorySchemas,
      ...storeSchemas,
      ...assetSchemas
    },
    parameters: {
      ...parameters,
      ...productParameters,
      ...attributeParameters,
      ...categoryParameters,
      ...storeParameters,
      csrfToken: {
        name: 'csrf-token',
        in: 'header',
        required: true,
        schema: { type: 'string' },
        description: 'CSRF token obtained from GET /csrf-token endpoint. Required for all write operations.'
      }
    },
    securitySchemes: {
      csrfToken: {
        type: 'apiKey',
        in: 'header',
        name: 'csrf-token',
        description: 'CSRF Token required for all POST, PUT, PATCH, and DELETE operations. First call GET /api/v1/csrf-token to obtain a token, then include it in the csrf-token header for subsequent requests.'
      }
    }
  },
  paths: {
    // ========== PRODUCTS ==========
    '/products': {
      get: {
        security: [],
        tags: ['Products'],
        summary: 'Get all products',
        description: 'Retrieve paginated list of products with optional filtering and sorting',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/SearchParam' },
          { $ref: '#/components/parameters/TypeFilterParam' },
          { $ref: '#/components/parameters/CategoryIdParam' },
          { $ref: '#/components/parameters/AttributesFilterParam' },
          { $ref: '#/components/parameters/SortByParam' },
          { $ref: '#/components/parameters/SortOrderParam' }
        ],
        responses: {
          200: {
            description: 'Products retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductListResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Products retrieved successfully',
                  data: [],
                  meta: {
                    total: 100,
                    page: 1,
                    limit: 10,
                    totalPages: 10
                  }
                }
              }
            }
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        description: 'Create a new product with unique SKU. **Requires CSRF token**.',
        parameters: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductCreateRequest' },
              examples: {
                simple: {
                  summary: 'Simple product',
                  value: {
                    sku: 'PROD-001',
                    type: 'SIMPLE',
                    attributeSetId: 1
                  }
                },
                configurable: {
                  summary: 'Configurable product',
                  value: {
                    sku: 'CONF-001',
                    type: 'CONFIGURABLE'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Product created successfully',
                  data: {
                    id: 1,
                    sku: 'PROD-001',
                    type: 'SIMPLE'
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' }
              }
            }
          },
          409: {
            description: 'SKU already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "A product with SKU 'PROD-001' already exists in the system.",
                  error: { error: 'sku-PROD-001' }
                }
              }
            }
          }
        }
      }
    },
    '/products/{id}': {
      get: {
        security: [],
        tags: ['Products'],
        summary: 'Get product by ID',
        description: 'Retrieve a single product by its ID',
        parameters: [
          { $ref: '#/components/parameters/IdParam' }
        ],
        responses: {
          200: {
            description: 'Product retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductDetailResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product retrieved successfully',
                  data: {
                    id: 1,
                    sku: 'PROD-001',
                    type: 'SIMPLE'
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid product ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Update product',
        description: 'Update an existing product',
        parameters: [
          { $ref: '#/components/parameters/IdParam' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductUpdateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Product updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product updated successfully',
                  data: {
                    id: 1,
                    sku: 'PROD-001-UPDATED',
                    type: 'SIMPLE'
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed or invalid product ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  validation: {
                    summary: 'Validation error',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Product update validation failed. Please check the provided data.',
                      error: {}
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Product ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Product with ID 123 was not found in the system.'
                }
              }
            }
          },
          409: {
            description: 'SKU already in use by another product',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "SKU 'PROD-001' is already in use by another product."
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product',
        description: 'Delete a product by ID',
        parameters: [
          { $ref: '#/components/parameters/IdParam' }
        ],
        responses: {
          200: {
            description: 'Product deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product deleted successfully',
                  data: {
                    id: 1,
                    sku: 'PROD-001'
                  }
                }
              }
            }
          },
          400: {
            description: 'Invalid product ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Product ID is required and must be a valid number.'
                }
              }
            }
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Product with ID 123 was not found and cannot be deleted.'
                }
              }
            }
          }
        }
      }
    },

    // ========== ATTRIBUTES ==========
    '/attributes': {
      get: {
        security: [],
        tags: ['Attributes'],
        summary: 'Get all attributes',
        description: 'Retrieve paginated list of attributes with optional filtering',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/SearchParam' },
          { $ref: '#/components/parameters/DataTypeFilterParam' },
          { $ref: '#/components/parameters/InputTypeFilterParam' },
          { $ref: '#/components/parameters/IsFilterableParam' },
          { $ref: '#/components/parameters/IsGlobalParam' },
          { $ref: '#/components/parameters/SortByParam' },
          { $ref: '#/components/parameters/SortOrderParam' }
        ],
        responses: {
          200: {
            description: 'Attributes retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attributes retrieved successfully',
                  data: [],
                  meta: {
                    total: 50,
                    page: 1,
                    limit: 10,
                    totalPages: 5
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Attributes'],
        summary: 'Create a new attribute',
        description: 'Create a new attribute with unique code',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AttributeCreateRequest' },
              examples: {
                string: {
                  summary: 'String attribute',
                  value: {
                    code: 'color',
                    label: 'Color',
                    dataType: 'STRING',
                    inputType: 'SELECT',
                    isFilterable: true,
                    isGlobal: true
                  }
                },
                decimal: {
                  summary: 'Decimal attribute',
                  value: {
                    code: 'price',
                    label: 'Price',
                    dataType: 'DECIMAL',
                    inputType: 'TEXT',
                    isRequired: true
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Attribute created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Attribute created successfully',
                  data: {
                    id: 1,
                    code: 'color',
                    label: 'Color'
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Attribute validation failed. Please check the provided data.',
                  error: {}
                }
              }
            }
          },
          409: {
            description: 'Attribute code already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "An attribute with code 'color' already exists in the system.",
                  error: { error: 'code-color' }
                }
              }
            }
          }
        }
      }
    },
    '/attributes/{id}': {
      get: {
        security: [],
        tags: ['Attributes'],
        summary: 'Get attribute by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Attribute retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute retrieved successfully',
                  data: {
                    id: 1,
                    code: 'color',
                    label: 'Color'
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Attributes'],
        summary: 'Update attribute',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AttributeCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Attribute updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute updated successfully',
                  data: {
                    id: 1,
                    code: 'color',
                    label: 'Color Updated'
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed or invalid attribute ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  validation: {
                    summary: 'Validation error',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Attribute update validation failed. Please check the provided data.',
                      error: {}
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Attribute ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Attribute not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Attribute with ID 123 was not found in the system.'
                }
              }
            }
          },
          409: {
            description: 'Attribute code already in use by another attribute',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "Attribute code 'color' is already in use by another attribute."
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Attributes'],
        summary: 'Delete attribute',
        description: 'Delete attribute if not associated with products',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Attribute deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute deleted successfully',
                  data: null
                }
              }
            }
          },
          400: {
            description: 'Invalid ID or attribute in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  inUse: {
                    summary: 'Attribute in use',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: "Cannot delete attribute 'Color' because it is currently associated with 5 product(s)."
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Attribute ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Attribute not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Attribute with ID 123 was not found and cannot be deleted.'
                }
              }
            }
          }
        }
      }
    },

    // ========== ATTRIBUTE SETS ==========
    '/attribute-sets': {
      get: {
        security: [],
        tags: ['Attribute Sets'],
        summary: 'Get all attribute sets',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Attribute sets retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute sets retrieved successfully',
                  data: [
                    {
                      id: 1,
                      name: 'Default',
                      sortOrder: 1
                    }
                  ],
                  meta: {
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    totalItems: 1
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Attribute Sets'],
        summary: 'Create attribute set',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AttributeSetCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Attribute set created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Attribute set created successfully',
                  data: {
                    id: 2,
                    name: 'Electronics',
                    sortOrder: 2
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed or duplicate attributes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  validation: {
                    summary: 'Validation error',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Failed to validate attribute set',
                      error: {}
                    }
                  },
                  duplicate: {
                    summary: 'Duplicate attribute',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Attribute cannot be duplicated in the same attribute set'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Attribute not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Attribute not found'
                }
              }
            }
          },
          409: {
            description: 'Attribute set code already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: 'Attribute set with the same code already exists',
                  error: { error: 'code-default' }
                }
              }
            }
          }
        }
      }
    },
    '/attribute-sets/{id}': {
      get: {
        security: [],
        tags: ['Attribute Sets'],
        summary: 'Get attribute set by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Attribute set retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute set retrieved successfully',
                  data: {
                    id: 1,
                    name: 'Default',
                    sortOrder: 1
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Attribute Sets'],
        summary: 'Update attribute set',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AttributeSetCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Attribute set updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute set updated successfully',
                  data: {
                    id: 1,
                    name: 'Default Updated',
                    sortOrder: 1
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Failed to validate attribute set',
                  error: {}
                }
              }
            }
          },
          404: {
            description: 'Attribute set not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Attribute set not found'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Attribute Sets'],
        summary: 'Delete attribute set',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Attribute set deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute set deleted successfully',
                  data: null
                }
              }
            }
          },
          400: {
            description: 'Invalid attribute set ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Attribute set ID is required and must be a valid number.'
                }
              }
            }
          },
          404: {
            description: 'Attribute set not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Attribute set not found and cannot be deleted.'
                }
              }
            }
          }
        }
      }
    },
    '/attribute-sets/{id}/attributes': {
      post: {
        tags: ['Attribute Sets'],
        summary: 'Add attribute to attribute set',
        description: 'Associate an attribute with an attribute set',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddAttributeToSetRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Attribute added to set successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Attribute added to set successfully',
                  data: {
                    id: 1,
                    attributeSetId: 1,
                    attributeId: 2
                  }
                }
              }
            }
          }
        }
      }
    },
    '/attribute-sets/{id}/attributes/{relationId}': {
      delete: {
        tags: ['Attribute Sets'],
        summary: 'Remove attribute from attribute set',
        parameters: [
          { $ref: '#/components/parameters/IdParam' },
          { $ref: '#/components/parameters/RelationIdParam' }
        ],
        responses: {
          200: {
            description: 'Attribute removed from set successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute removed from set successfully',
                  data: null
                }
              }
            }
          }
        }
      }
    },
    '/attribute-sets/{id}/groups/{groupId}/attributes': {
      post: {
        tags: ['Attribute Sets'],
        summary: 'Add attribute to group in set',
        description: 'Add an attribute to a specific group within an attribute set',
        parameters: [
          { $ref: '#/components/parameters/IdParam' },
          { $ref: '#/components/parameters/GroupIdParam' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddAttributeToGroupRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Attribute added to group successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' }
              }
            }
          }
        }
      }
    },
    '/attribute-sets/{id}/groups/{groupId}/attributes/{relationId}': {
      delete: {
        tags: ['Attribute Sets'],
        summary: 'Remove attribute from group',
        parameters: [
          { $ref: '#/components/parameters/IdParam' },
          { $ref: '#/components/parameters/GroupIdParam' },
          { $ref: '#/components/parameters/RelationIdParam' }
        ],
        responses: {
          200: {
            description: 'Attribute removed from group successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute removed from group successfully',
                  data: null
                }
              }
            }
          }
        }
      }
    },

    // ========== ATTRIBUTE GROUPS ==========
    '/attribute-groups': {
      get: {
        security: [],
        tags: ['Attribute Groups'],
        summary: 'Get all attribute groups',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Attribute groups retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute groups retrieved successfully',
                  data: [
                    {
                      id: 1,
                      name: 'General',
                      sortOrder: 1
                    }
                  ],
                  meta: {
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    totalItems: 1
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Attribute Groups'],
        summary: 'Create attribute group',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AttributeGroupCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Attribute group created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Attribute group created successfully',
                  data: {
                    id: 2,
                    name: 'Product Details',
                    sortOrder: 2
                  }
                }
              }
            }
          }
        }
      }
    },
    '/attribute-groups/{id}': {
      get: {
        security: [],
        tags: ['Attribute Groups'],
        summary: 'Get attribute group by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Attribute group retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute group retrieved successfully',
                  data: {
                    id: 1,
                    name: 'General',
                    sortOrder: 1
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Attribute Groups'],
        summary: 'Update attribute group',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AttributeGroupCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Attribute group updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute group updated successfully',
                  data: {
                    id: 1,
                    name: 'General Updated',
                    sortOrder: 1
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Attribute Groups'],
        summary: 'Delete attribute group',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Attribute group deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Attribute group deleted successfully',
                  data: null
                }
              }
            }
          }
        }
      }
    },

    // ========== PRODUCT ATTRIBUTES ==========
    '/product-attributes': {
      get: {
        security: [],
        tags: ['Product Attributes'],
        summary: 'Get all product attribute values',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Product attributes retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product attributes retrieved successfully',
                  data: [
                    {
                      id: 1,
                      productId: 1,
                      attributeId: 2,
                      value: 'Red'
                    }
                  ],
                  meta: {
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    totalItems: 1
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Product Attributes'],
        summary: 'Create product attribute value',
        description: 'Assign an attribute value to a product',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductAttributeValueCreateRequest' },
              examples: {
                stringValue: {
                  summary: 'String value example',
                  value: {
                    productId: 1,
                    attributeId: 1,
                    storeViewId: null,
                    valueString: 'Red'
                  }
                },
                decimalValue: {
                  summary: 'Decimal value example',
                  value: {
                    productId: 1,
                    attributeId: 2,
                    storeViewId: 1,
                    valueDecimal: 19.99
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Product attribute value created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Product attribute value created successfully',
                  data: {
                    id: 1,
                    productId: 1,
                    attributeId: 2,
                    storeViewId: null,
                    valueString: 'Red'
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Failed to validate product attribute',
                  error: {}
                }
              }
            }
          },
          404: {
            description: 'Product, attribute, or store view not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                examples: {
                  product: {
                    summary: 'Product not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Product not found'
                    }
                  },
                  attribute: {
                    summary: 'Attribute not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Attribute not found'
                    }
                  },
                  storeView: {
                    summary: 'Store view not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Store view not found'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/product-attributes/{id}': {
      get: {
        security: [],
        tags: ['Product Attributes'],
        summary: 'Get product attribute value by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Product attribute value retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Product Attributes'],
        summary: 'Update product attribute value',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductAttributeValueCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Product attribute value updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product attribute value updated successfully',
                  data: {
                    id: 1,
                    productId: 1,
                    attributeId: 2,
                    storeViewId: null,
                    valueString: 'Blue'
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Product Attributes'],
        summary: 'Delete product attribute value',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Product attribute value deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product attribute value deleted successfully',
                  data: null
                }
              }
            }
          }
        }
      }
    },
    '/product-attributes/products/{productId}/attributes/{attributeId}': {
      delete: {
        tags: ['Product Attributes'],
        summary: 'Delete product attribute by composite key (global)',
        description: 'Delete a global product attribute value using product and attribute IDs',
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Product ID'
          },
          { $ref: '#/components/parameters/AttributeIdParam' }
        ],
        responses: {
          200: {
            description: 'Product attribute deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      }
    },
    '/product-attributes/products/{productId}/attributes/{attributeId}/store-views/{storeViewId}': {
      delete: {
        tags: ['Product Attributes'],
        summary: 'Delete product attribute by composite key (scoped)',
        description: 'Delete a store-view-specific product attribute value',
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Product ID'
          },
          { $ref: '#/components/parameters/AttributeIdParam' },
          {
            name: 'storeViewId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Store view ID'
          }
        ],
        responses: {
          200: {
            description: 'Product attribute deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      }
    },

    // ========== CATEGORIES ==========
    '/categories': {
      get: {
        security: [],
        tags: ['Categories'],
        summary: 'Get all categories',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/SearchParam' },
          { $ref: '#/components/parameters/ParentIdFilterParam' },
          { $ref: '#/components/parameters/SortByParam' },
          { $ref: '#/components/parameters/SortOrderParam' }
        ],
        responses: {
          200: {
            description: 'Categories retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Categories retrieved successfully',
                  data: [
                    {
                      id: 1,
                      name: 'Electronics',
                      parentId: null,
                      sortOrder: 1
                    }
                  ],
                  meta: {
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    totalItems: 1
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Categories'],
        summary: 'Create category',
        description: 'Create a new category with optional parent',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Category created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Category created successfully',
                  data: {
                    id: 2,
                    name: 'Laptops',
                    parentId: 1,
                    sortOrder: 1
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Category validation failed. Please check the provided data.',
                  error: {}
                }
              }
            }
          },
          404: {
            description: 'Parent category not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Parent category with ID 123 was not found.'
                }
              }
            }
          }
        }
      }
    },
    '/categories/root': {
      get: {
        security: [],
        tags: ['Categories'],
        summary: 'Get root categories',
        description: 'Get all categories without a parent',
        responses: {
          200: {
            description: 'Root categories retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Root categories retrieved successfully',
                  data: [
                    {
                      id: 1,
                      name: 'Electronics',
                      parentId: null,
                      sortOrder: 1
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/categories/parent/{parentId}': {
      get: {
        security: [],
        tags: ['Categories'],
        summary: 'Get child categories by parent',
        description: 'Get all subcategories of a specific parent category',
        parameters: [{ $ref: '#/components/parameters/ParentIdParam' }],
        responses: {
          200: {
            description: 'Child categories retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Child categories retrieved successfully',
                  data: [
                    {
                      id: 2,
                      name: 'Laptops',
                      parentId: 1,
                      sortOrder: 1
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    '/categories/{id}': {
      get: {
        security: [],
        tags: ['Categories'],
        summary: 'Get category by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Category retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Category retrieved successfully',
                  data: {
                    id: 1,
                    name: 'Electronics',
                    parentId: null,
                    sortOrder: 1
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Categories'],
        summary: 'Update category',
        description: 'Update category (prevents circular parent relationships)',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryUpdateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Category updated successfully',
                  data: {
                    id: 1,
                    name: 'Electronics Updated',
                    parentId: null,
                    sortOrder: 1
                  }
                }
              }
            }
          },
          400: {
            description: 'Validation failed or self-parent error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  validation: {
                    summary: 'Validation error',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Category update validation failed. Please check the provided data.',
                      error: {}
                    }
                  },
                  selfParent: {
                    summary: 'Self-parent error',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'A category cannot be set as its own parent.'
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Category ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Category or parent category not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                examples: {
                  category: {
                    summary: 'Category not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Category with ID 123 was not found in the system.'
                    }
                  },
                  parent: {
                    summary: 'Parent category not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Parent category with ID 456 was not found.'
                    }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete category',
        description: 'Delete category if it has no subcategories',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Category deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Category deleted successfully',
                  data: null
                }
              }
            }
          },
          400: {
            description: 'Invalid ID or category has subcategories',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  hasSubcategories: {
                    summary: 'Has subcategories',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Cannot delete category because it contains 3 subcategory(ies). Please delete or reassign subcategories first.'
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Category ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Category with ID 123 was not found and cannot be deleted.'
                }
              }
            }
          }
        }
      }
    },

    // ========== CATEGORY TRANSLATIONS ==========
    '/category-translations': {
      get: {
        security: [],
        tags: ['Category Translations'],
        summary: 'Get all category translations',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Category translations retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Category translations retrieved successfully',
                  data: [
                    {
                      id: 1,
                      categoryId: 1,
                      locale: 'en',
                      name: 'Electronics'
                    }
                  ],
                  meta: {
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    totalItems: 1
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Category Translations'],
        summary: 'Create category translation',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryTranslationCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Category translation created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Category translation created successfully',
                  data: {
                    id: 2,
                    categoryId: 1,
                    locale: 'fr',
                    name: 'Électronique'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/category-translations/{id}': {
      get: {
        security: [],
        tags: ['Category Translations'],
        summary: 'Get category translation by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Category translation retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Category Translations'],
        summary: 'Update category translation',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CategoryTranslationCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Category translation updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Category translation updated successfully',
                  data: {
                    id: 2,
                    categoryId: 1,
                    locale: 'fr',
                    name: 'Électronique Updated'
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Category Translations'],
        summary: 'Delete category translation',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Category translation deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Category translation deleted successfully',
                  data: null
                }
              }
            }
          }
        }
      }
    },

    // ========== PRODUCT CATEGORIES ==========
    '/product-categories': {
      get: {
        security: [],
        tags: ['Product Categories'],
        summary: 'Get all product-category associations',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Product categories retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product categories retrieved successfully',
                  data: [
                    {
                      id: 1,
                      productId: 1,
                      categoryId: 1
                    }
                  ],
                  meta: {
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    totalItems: 1
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Product Categories'],
        summary: 'Create product-category association',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductCategoryCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Product-category association created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Product-category association created successfully',
                  data: {
                    id: 2,
                    productId: 1,
                    categoryId: 2
                  }
                }
              }
            }
          }
        }
      }
    },
    '/product-categories/{id}': {
      get: {
        security: [],
        tags: ['Product Categories'],
        summary: 'Get product-category association by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Product-category association retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Product Categories'],
        summary: 'Update product-category association',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductCategoryCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Product-category association updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Product Categories'],
        summary: 'Delete product-category association',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Product-category association deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product-category association deleted successfully',
                  data: null
                }
              }
            }
          }
        }
      }
    },

    // ========== ASSETS ==========
    '/assets': {
      get: {
        security: [],
        tags: ['Assets'],
        summary: 'Get all assets',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Assets retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Assets'],
        summary: 'Create asset',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AssetCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Asset created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' }
              }
            }
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Asset validation failed. Please check the provided data.',
                  error: {}
                }
              }
            }
          },
          409: {
            description: 'Asset file path already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "An asset with file path '/images/product.jpg' already exists in the system.",
                  error: { error: 'filePath-/images/product.jpg' }
                }
              }
            }
          }
        }
      }
    },
    '/assets/{id}': {
      get: {
        security: [],
        tags: ['Assets'],
        summary: 'Get asset by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Asset retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Assets'],
        summary: 'Update asset',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AssetCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Asset updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          },
          400: {
            description: 'Validation failed or invalid asset ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  validation: {
                    summary: 'Validation error',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Asset update validation failed. Please check the provided data.',
                      error: {}
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Asset ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Asset not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Asset with ID 123 was not found in the system.'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Assets'],
        summary: 'Delete asset',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Asset deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          },
          400: {
            description: 'Invalid asset ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Asset ID is required and must be a valid number.'
                }
              }
            }
          },
          404: {
            description: 'Asset not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Asset with ID 123 was not found and cannot be deleted.'
                }
              }
            }
          }
        }
      }
    },

    // ========== PRODUCT ASSETS ==========
    '/product-assets': {
      get: {
        security: [],
        tags: ['Product Assets'],
        summary: 'Get all product-asset associations',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Product assets retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product assets retrieved successfully',
                  data: [
                    {
                      id: 1,
                      productId: 1,
                      assetId: 1,
                      sortOrder: 1
                    }
                  ],
                  meta: {
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                    totalItems: 1
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Product Assets'],
        summary: 'Create product-asset association',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductAssetCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Product-asset association created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' },
                example: {
                  success: true,
                  statusCode: 201,
                  message: 'Product-asset association created successfully',
                  data: {
                    id: 2,
                    productId: 1,
                    assetId: 2,
                    sortOrder: 2
                  }
                }
              }
            }
          }
        }
      }
    },
    '/product-assets/{id}': {
      get: {
        security: [],
        tags: ['Product Assets'],
        summary: 'Get product-asset association by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Product-asset association retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product-asset association retrieved successfully',
                  data: {
                    id: 1,
                    productId: 1,
                    assetId: 1,
                    sortOrder: 1
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Product Assets'],
        summary: 'Update product-asset association',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductAssetCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Product-asset association updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product-asset association updated successfully',
                  data: {
                    id: 1,
                    productId: 1,
                    assetId: 1,
                    sortOrder: 3
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Product Assets'],
        summary: 'Delete product-asset association',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Product-asset association deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
                example: {
                  success: true,
                  statusCode: 200,
                  message: 'Product-asset association deleted successfully',
                  data: null
                }
              }
            }
          }
        }
      }
    },

    // ========== STORES ==========
    '/stores': {
      get: {
        security: [],
        tags: ['Stores'],
        summary: 'Get all stores',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Stores retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Stores'],
        summary: 'Create store',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StoreCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Store created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' }
              }
            }
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Store validation failed. Please check the provided data.',
                  error: {}
                }
              }
            }
          },
          409: {
            description: 'Store code already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "A store with code 'us-store' already exists in the system.",
                  error: { error: 'code-us-store' }
                }
              }
            }
          }
        }
      }
    },
    '/stores/code/{code}': {
      get: {
        security: [],
        tags: ['Stores'],
        summary: 'Get store by code',
        description: 'Retrieve a store by its unique code',
        parameters: [{ $ref: '#/components/parameters/CodeParam' }],
        responses: {
          200: {
            description: 'Store retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      }
    },
    '/stores/{id}': {
      get: {
        security: [],
        tags: ['Stores'],
        summary: 'Get store by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Store retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Stores'],
        summary: 'Update store',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StoreCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Store updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          },
          400: {
            description: 'Validation failed or invalid store ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  validation: {
                    summary: 'Validation error',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Store update validation failed. Please check the provided data.',
                      error: {}
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Store ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Store not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Store with ID 123 was not found in the system.'
                }
              }
            }
          },
          409: {
            description: 'Store code already in use by another store',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "Store code 'us-store' is already in use by another store."
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Stores'],
        summary: 'Delete store',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Store deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          },
          400: {
            description: 'Invalid ID or store has store views',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  hasStoreViews: {
                    summary: 'Has store views',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Cannot delete store because it has 3 associated store view(s). Please delete or reassign store views first.'
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Store ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Store not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Store with ID 123 was not found and cannot be deleted.'
                }
              }
            }
          }
        }
      }
    },

    // ========== STORE VIEWS ==========
    '/store-views': {
      get: {
        security: [],
        tags: ['Store Views'],
        summary: 'Get all store views',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Store views retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Store Views'],
        summary: 'Create store view',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StoreViewCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Store view created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' }
              }
            }
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Store view validation failed. Please check the provided data.',
                  error: {}
                }
              }
            }
          },
          404: {
            description: 'Store or locale not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                examples: {
                  store: {
                    summary: 'Store not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Store with ID 123 was not found in the system.'
                    }
                  },
                  locale: {
                    summary: 'Locale not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Locale with ID 456 was not found in the system.'
                    }
                  }
                }
              }
            }
          },
          409: {
            description: 'Store view code already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "A store view with code 'en-us' already exists in the system.",
                  error: { error: 'code-en-us' }
                }
              }
            }
          }
        }
      }
    },
    '/store-views/{id}': {
      get: {
        security: [],
        tags: ['Store Views'],
        summary: 'Get store view by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Store view retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Store Views'],
        summary: 'Update store view',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StoreViewCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Store view updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          },
          400: {
            description: 'Validation failed or invalid store view ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  validation: {
                    summary: 'Validation error',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Store view update validation failed. Please check the provided data.'
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Store view ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Store view, store, or locale not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                examples: {
                  storeView: {
                    summary: 'Store view not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Store view with ID 123 was not found in the system.'
                    }
                  },
                  store: {
                    summary: 'Store not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Store with ID 456 was not found in the system.'
                    }
                  },
                  locale: {
                    summary: 'Locale not found',
                    value: {
                      success: false,
                      statusCode: 404,
                      message: 'Locale with ID 789 was not found in the system.'
                    }
                  }
                }
              }
            }
          },
          409: {
            description: 'Store view code already in use by another store view',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "Store view code 'en-us' is already in use by another store view."
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Store Views'],
        summary: 'Delete store view',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Store view deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          },
          400: {
            description: 'Invalid ID or store view has associated data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Store view ID is required and must be a valid number.'
                }
              }
            }
          },
          404: {
            description: 'Store view not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Store view with ID 123 was not found and cannot be deleted.'
                }
              }
            }
          }
        }
      }
    },

    // ========== LOCALES ==========
    '/locales': {
      get: {
        security: [],
        tags: ['Locales'],
        summary: 'Get all locales',
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' }
        ],
        responses: {
          200: {
            description: 'Locales retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Locales'],
        summary: 'Create locale',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LocaleCreateRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Locale created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreatedResponse' }
              }
            }
          },
          400: {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                example: {
                  success: false,
                  statusCode: 400,
                  message: 'Locale validation failed. Please check the provided data.',
                  error: {}
                }
              }
            }
          },
          409: {
            description: 'Locale value already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "A locale with value 'en_US' already exists in the system.",
                  error: { error: 'value-en_US' }
                }
              }
            }
          }
        }
      }
    },
    '/locales/{id}': {
      get: {
        security: [],
        tags: ['Locales'],
        summary: 'Get locale by ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Locale retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Locales'],
        summary: 'Update locale',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LocaleCreateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Locale updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          },
          400: {
            description: 'Validation failed or invalid locale ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  validation: {
                    summary: 'Validation error',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Locale update validation failed. Please check the provided data.',
                      error: {}
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Locale ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Locale not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Locale with ID 123 was not found in the system.'
                }
              }
            }
          },
          409: {
            description: 'Locale value already in use by another locale',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  statusCode: 409,
                  message: "Locale value 'en_US' is already in use by another locale."
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Locales'],
        summary: 'Delete locale',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: 'Locale deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          },
          400: {
            description: 'Invalid ID or locale in use by store view',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestResponse' },
                examples: {
                  inUse: {
                    summary: 'Locale in use',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: "Cannot delete locale 'English (US)' because it is currently associated with store view 'US Store View'. Please reassign the store view to a different locale first."
                    }
                  },
                  invalidId: {
                    summary: 'Invalid ID',
                    value: {
                      success: false,
                      statusCode: 400,
                      message: 'Locale ID is required and must be a valid number.'
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Locale not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundResponse' },
                example: {
                  success: false,
                  statusCode: 404,
                  message: 'Locale with ID 123 was not found and cannot be deleted.'
                }
              }
            }
          }
        }
      }
    },

    // ========== ANALYTICS ==========
    '/analytics/dashboard': {
      get: {
        security: [],
        tags: ['Analytics'],
        summary: 'Get dashboard analytics',
        description: 'Retrieve comprehensive dashboard analytics and metrics',
        responses: {
          200: {
            description: 'Dashboard analytics retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Dashboard analytics retrieved successfully' },
                    data: { $ref: '#/components/schemas/Analytics' }
                  }
                }
              }
            }
          },
          500: {
            description: 'Failed to retrieve analytics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },

    // ========== CSRF ==========
    '/csrf-token': {
      get: {
        security: [],
        tags: ['Security'],
        summary: 'Get CSRF token',
        description: 'Retrieve CSRF token for form submissions',
        responses: {
          200: {
            description: 'CSRF token retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'CSRF token retrieved successfully' },
                    data: { $ref: '#/components/schemas/CSRFToken' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: [] // We're defining everything in this file, no JSDoc comments needed
};

export const swaggerSpec = swaggerJsdoc(options);
