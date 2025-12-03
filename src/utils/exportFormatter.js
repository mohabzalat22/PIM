import { js2xml } from 'xml-js';
import { format } from 'fast-csv';

/**
 * Serialize data to handle Prisma Decimal types
 * @param {*} value - Value to serialize
 * @returns {*} Serialized value
 */
const serializeValue = (value) => {
  if (value === null || value === undefined) {
    return value;
  }
  
  // Handle Prisma Decimal type
  if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'Decimal') {
    return parseFloat(value.toString());
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => serializeValue(item));
  }
  
  // Handle objects
  if (typeof value === 'object') {
    const serialized = {};
    for (const [key, val] of Object.entries(value)) {
      serialized[key] = serializeValue(val);
    }
    return serialized;
  }
  
  return value;
};

/**
 * Flatten nested product data for CSV export
 * @param {Object} product - Product with nested relations
 * @returns {Object} Flattened product data
 */
const flattenProductForCSV = (product) => {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description || '',
    productType: product.productType,
    attributeSetId: product.attributeSetId,
    attributeSetName: product.attributeSet?.name || '',
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    // Store relations as JSON strings
    assets: JSON.stringify(product.productAssets?.map(pa => ({
      assetId: pa.assetId,
      url: pa.asset?.url,
      type: pa.type,
      position: pa.position
    })) || []),
    categories: JSON.stringify(product.productCategories?.map(pc => ({
      categoryId: pc.categoryId,
      categoryName: pc.category?.name
    })) || []),
    attributes: JSON.stringify(product.productAttributeValues?.map(pav => ({
      attributeCode: pav.attribute?.code,
      attributeLabel: pav.attribute?.label,
      valueString: pav?.valueString,
      valueInt: pav?.valueInt,
      valueDecimal: pav?.valueDecimal,
      valueBoolean: pav?.valueBoolean,
      valueText: pav?.valueText,
      valueJson: pav?.valueJson,
      storeViewId: pav.storeViewId
    })) || [])
  };
};

/**
 * Format products data to JSON
 * @param {Array} products - Array of products with relations
 * @returns {String} JSON string
 */
export const formatToJSON = (products) => {
  const serializedProducts = products.map(product => serializeValue(product));
  return JSON.stringify({ products: serializedProducts }, null, 2);
};

/**
 * Format products data to XML
 * @param {Array} products - Array of products with relations
 * @returns {String} XML string
 */
export const formatToXML = (products) => {
  const serializedProducts = products.map(product => serializeValue(product));
  
  const data = {
    declaration: {
      attributes: {
        version: '1.0',
        encoding: 'utf-8'
      }
    },
    elements: [
      {
        type: 'element',
        name: 'products',
        elements: serializedProducts.map(product => ({
          type: 'element',
          name: 'product',
          elements: convertObjectToXMLElements(product)
        }))
      }
    ]
  };
  
  return js2xml(data, {
    compact: false,
    spaces: 2
  });
};

/**
 * Convert object to XML elements structure
 * @param {Object} obj - Object to convert
 * @returns {Array} Array of XML elements
 */
const convertObjectToXMLElements = (obj) => {
  const elements = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue;
    }
    
    if (Array.isArray(value)) {
      // Handle arrays
      elements.push({
        type: 'element',
        name: key,
        elements: value.map(item => {
          if (typeof item === 'object' && item !== null) {
            return {
              type: 'element',
              name: 'item',
              elements: convertObjectToXMLElements(item)
            };
          }
          return {
            type: 'element',
            name: 'item',
            elements: [{ type: 'text', text: String(item) }]
          };
        })
      });
    } else if (typeof value === 'object' && value !== null) {
      // Handle nested objects
      elements.push({
        type: 'element',
        name: key,
        elements: convertObjectToXMLElements(value)
      });
    } else {
      // Handle primitive values
      elements.push({
        type: 'element',
        name: key,
        elements: [{ type: 'text', text: String(value) }]
      });
    }
  }
  
  return elements;
};

/**
 * Format products data to CSV
 * @param {Array} products - Array of products with relations
 * @returns {Promise<String>} CSV string
 */
export const formatToCSV = async (products) => {
  return new Promise((resolve, reject) => {
    const flattenedProducts = products.map(flattenProductForCSV);
    const csvData = [];
    
    const csvStream = format({ headers: true })
      .on('data', (row) => csvData.push(row))
      .on('end', () => resolve(csvData.join('')))
      .on('error', (error) => reject(error));
    
    flattenedProducts.forEach(product => csvStream.write(product));
    csvStream.end();
  });
};

/**
 * Get appropriate content type for format
 * @param {String} format - Export format (json, xml, csv)
 * @returns {String} Content type
 */
export const getContentType = (format) => {
  const contentTypes = {
    json: 'application/json',
    xml: 'application/xml',
    csv: 'text/csv'
  };
  
  return contentTypes[format] || 'application/octet-stream';
};

/**
 * Get appropriate file extension for format
 * @param {String} format - Export format (json, xml, csv)
 * @returns {String} File extension
 */
export const getFileExtension = (format) => {
  const extensions = {
    json: 'json',
    xml: 'xml',
    csv: 'csv'
  };
  
  return extensions[format] || 'txt';
};
