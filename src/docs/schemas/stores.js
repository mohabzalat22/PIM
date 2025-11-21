/**
 * Store Related Schemas
 */

export const storeSchemas = {
  Store: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Store ID'
      },
      code: {
        type: 'string',
        example: 'main',
        description: 'Unique store code'
      },
      name: {
        type: 'string',
        example: 'Main Store',
        description: 'Store name'
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

  StoreCreateRequest: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'main',
        description: 'Unique store code (required, must be unique)'
      },
      name: {
        type: 'string',
        example: 'Main Store',
        description: 'Store name (required)'
      }
    },
    required: ['code', 'name']
  },

  StoreView: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Store view ID'
      },
      code: {
        type: 'string',
        example: 'en_us',
        description: 'Unique store view code'
      },
      name: {
        type: 'string',
        example: 'English (US)',
        description: 'Store view name'
      },
      storeId: {
        type: 'integer',
        example: 1,
        description: 'Associated store ID'
      },
      localeId: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: 'Associated locale ID'
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

  StoreViewCreateRequest: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'en_us',
        description: 'Unique store view code (required)'
      },
      name: {
        type: 'string',
        example: 'English (US)',
        description: 'Store view name (required)'
      },
      storeId: {
        type: 'integer',
        example: 1,
        description: 'Store ID (required)'
      },
      localeId: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: 'Locale ID (optional)'
      }
    },
    required: ['code', 'name', 'storeId']
  },

  Locale: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Locale ID'
      },
      code: {
        type: 'string',
        example: 'en_US',
        description: 'Unique locale code (e.g., en_US, fr_FR)'
      },
      name: {
        type: 'string',
        example: 'English (United States)',
        description: 'Locale display name'
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

  LocaleCreateRequest: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'en_US',
        description: 'Unique locale code (required, must be unique)'
      },
      name: {
        type: 'string',
        example: 'English (United States)',
        description: 'Locale name (required)'
      }
    },
    required: ['code', 'name']
  }
};

export const storeParameters = {
  CodeParam: {
    name: 'code',
    in: 'path',
    required: true,
    schema: {
      type: 'string'
    },
    description: 'Store code'
  }
};
