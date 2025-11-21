/**
 * Attribute Related Schemas
 */

export const attributeSchemas = {
  Attribute: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Attribute ID'
      },
      code: {
        type: 'string',
        example: 'color',
        description: 'Unique attribute code'
      },
      label: {
        type: 'string',
        example: 'Color',
        description: 'Attribute display label'
      },
      dataType: {
        type: 'string',
        enum: ['BOOLEAN', 'STRING', 'INT', 'DECIMAL', 'TEXT', 'JSON'],
        example: 'STRING',
        description: 'Data type for attribute values'
      },
      inputType: {
        type: 'string',
        enum: ['TEXT', 'SELECT', 'MULTISELECT', 'DATE', 'MEDIA'],
        example: 'SELECT',
        description: 'Input type for UI'
      },
      isRequired: {
        type: 'boolean',
        example: false,
        description: 'Whether attribute is required'
      },
      isFilterable: {
        type: 'boolean',
        example: true,
        description: 'Whether attribute can be used for filtering'
      },
      isGlobal: {
        type: 'boolean',
        example: true,
        description: 'Whether attribute is global or store-view specific'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time'
      }
    },
    required: ['id', 'code', 'dataType', 'inputType']
  },

  AttributeCreateRequest: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'color',
        description: 'Unique attribute code (required, must be unique)'
      },
      label: {
        type: 'string',
        example: 'Color',
        description: 'Attribute display label (required)'
      },
      dataType: {
        type: 'string',
        enum: ['BOOLEAN', 'STRING', 'INT', 'DECIMAL', 'TEXT', 'JSON'],
        example: 'STRING',
        description: 'Data type (required)'
      },
      inputType: {
        type: 'string',
        enum: ['TEXT', 'SELECT', 'MULTISELECT', 'DATE', 'MEDIA'],
        example: 'SELECT',
        description: 'Input type (required)'
      },
      isRequired: {
        type: 'boolean',
        example: false,
        default: false,
        description: 'Whether attribute is required (optional)'
      },
      isFilterable: {
        type: 'boolean',
        example: true,
        default: false,
        description: 'Whether attribute is filterable (optional)'
      },
      isGlobal: {
        type: 'boolean',
        example: true,
        default: true,
        description: 'Whether attribute is global (optional)'
      }
    },
    required: ['code', 'label', 'dataType', 'inputType']
  },

  AttributeSet: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1
      },
      name: {
        type: 'string',
        example: 'Default',
        description: 'Attribute set name'
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

  AttributeSetCreateRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Electronics',
        description: 'Attribute set name (required)'
      }
    },
    required: ['name']
  },

  AttributeGroup: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1
      },
      name: {
        type: 'string',
        example: 'General',
        description: 'Attribute group name'
      },
      attributeSetId: {
        type: 'integer',
        example: 1,
        description: 'Associated attribute set ID'
      },
      sortOrder: {
        type: 'integer',
        example: 1,
        description: 'Display order'
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

  AttributeGroupCreateRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'Technical Specifications',
        description: 'Attribute group name (required)'
      },
      attributeSetId: {
        type: 'integer',
        example: 1,
        description: 'Associated attribute set ID (required)'
      },
      sortOrder: {
        type: 'integer',
        example: 1,
        description: 'Display order (optional)'
      }
    },
    required: ['name', 'attributeSetId']
  },

  ProductAttributeValue: {
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
      attributeId: {
        type: 'integer',
        example: 1,
        description: 'Associated attribute ID'
      },
      storeViewId: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: 'Store view ID (null for global values)'
      },
      valueString: {
        type: 'string',
        nullable: true,
        example: 'Red',
        description: 'String value'
      },
      valueInt: {
        type: 'integer',
        nullable: true,
        example: 42,
        description: 'Integer value'
      },
      valueDecimal: {
        type: 'number',
        nullable: true,
        example: 19.99,
        description: 'Decimal value'
      },
      valueText: {
        type: 'string',
        nullable: true,
        example: 'Long description text',
        description: 'Text value'
      },
      valueBoolean: {
        type: 'boolean',
        nullable: true,
        example: true,
        description: 'Boolean value'
      },
      valueJson: {
        type: 'object',
        nullable: true,
        example: { option1: 'value1', option2: 'value2' },
        description: 'JSON value'
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

  ProductAttributeValueCreateRequest: {
    type: 'object',
    properties: {
      productId: {
        type: 'integer',
        example: 1,
        description: 'Product ID (required)'
      },
      attributeId: {
        type: 'integer',
        example: 1,
        description: 'Attribute ID (required)'
      },
      storeViewId: {
        type: 'integer',
        nullable: true,
        example: null,
        description: 'Store view ID (optional, null for global)'
      },
      valueString: {
        type: 'string',
        nullable: true,
        example: 'Red'
      },
      valueInt: {
        type: 'integer',
        nullable: true,
        example: 42
      },
      valueDecimal: {
        type: 'number',
        nullable: true,
        example: 19.99
      },
      valueText: {
        type: 'string',
        nullable: true
      },
      valueBoolean: {
        type: 'boolean',
        nullable: true
      },
      valueJson: {
        type: 'object',
        nullable: true
      }
    },
    required: ['productId', 'attributeId']
  },

  AddAttributeToSetRequest: {
    type: 'object',
    properties: {
      attributeId: {
        type: 'integer',
        example: 1,
        description: 'Attribute ID to add (required)'
      },
      sortOrder: {
        type: 'integer',
        example: 1,
        description: 'Display order (optional)'
      }
    },
    required: ['attributeId']
  },

  AddAttributeToGroupRequest: {
    type: 'object',
    properties: {
      attributeId: {
        type: 'integer',
        example: 1,
        description: 'Attribute ID to add (required)'
      },
      sortOrder: {
        type: 'integer',
        example: 1,
        description: 'Display order (optional)'
      }
    },
    required: ['attributeId']
  }
};

export const attributeParameters = {
  DataTypeFilterParam: {
    name: 'dataType',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['BOOLEAN', 'STRING', 'INT', 'DECIMAL', 'TEXT', 'JSON']
    },
    description: 'Filter attributes by data type'
  },

  InputTypeFilterParam: {
    name: 'inputType',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      enum: ['TEXT', 'SELECT', 'MULTISELECT', 'DATE', 'MEDIA']
    },
    description: 'Filter attributes by input type'
  },

  IsFilterableParam: {
    name: 'isFilterable',
    in: 'query',
    required: false,
    schema: {
      type: 'boolean'
    },
    description: 'Filter by filterable status'
  },

  IsGlobalParam: {
    name: 'isGlobal',
    in: 'query',
    required: false,
    schema: {
      type: 'boolean'
    },
    description: 'Filter by global status'
  },

  AttributeIdParam: {
    name: 'attributeId',
    in: 'path',
    required: true,
    schema: {
      type: 'integer',
      minimum: 1
    },
    description: 'Attribute ID'
  },

  GroupIdParam: {
    name: 'groupId',
    in: 'path',
    required: true,
    schema: {
      type: 'integer',
      minimum: 1
    },
    description: 'Attribute group ID'
  },

  RelationIdParam: {
    name: 'relationId',
    in: 'path',
    required: true,
    schema: {
      type: 'integer',
      minimum: 1
    },
    description: 'Relation ID'
  }
};
