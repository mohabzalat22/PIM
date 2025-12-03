import { xml2js } from 'xml-js';
import { parse } from 'fast-csv';
import { Readable } from 'stream';

/**
 * Parse JSON file content
 * @param {String} content - JSON file content
 * @returns {Promise<Object>} Parsed data
 */
export const parseJSON = async (content) => {
  try {
    const data = JSON.parse(content);
    
    // Validate structure
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error('Invalid JSON structure. Expected { products: [...] }');
    }
    
    return data.products;
  } catch (error) {
    throw new Error(`JSON parsing error: ${error.message}`);
  }
};

/**
 * Parse XML file content
 * @param {String} content - XML file content
 * @returns {Promise<Array>} Parsed products array
 */
export const parseXML = async (content) => {
  try {
    const result = xml2js(content, {
      compact: false,
      trim: true,
      ignoreComment: true,
      ignoreDeclaration: true,
      textKey: '_text',
      attributesKey: '_attributes'
    });
    
    const jsonData = JSON.parse(result);
    
    // Navigate the XML structure to find products
    let products = [];
    if (jsonData.elements) {
      const productsElement = jsonData.elements.find(el => el.name === 'products');
      if (productsElement && productsElement.elements) {
        products = productsElement.elements
          .filter(el => el.name === 'product')
          .map(productElement => extractElementData(productElement));
      }
    }
    
    if (!products.length) {
      throw new Error('No products found in XML');
    }
    
    return products;
  } catch (error) {
    throw new Error(`XML parsing error: ${error.message}`);
  }
};

/**
 * Extract data from XML element structure
 * @param {Object} element - XML element
 * @returns {Object} Extracted data
 */
const extractElementData = (element) => {
  if (!element.elements || element.elements.length === 0) {
    // Leaf node - return text content
    return element.elements?.[0]?._text || element._text || '';
  }
  
  const data = {};
  
  element.elements.forEach(child => {
    if (!child.name) return;
    
    if (child.elements && child.elements.length > 0) {
      // Check if it's an array (multiple items with same name)
      const firstChild = child.elements[0];
      
      if (firstChild.name === 'item') {
        // It's an array
        data[child.name] = child.elements.map(el => extractElementData(el));
      } else if (firstChild._text !== undefined || firstChild.elements) {
        // Check if all children have the same name (array) or different names (object)
        const childNames = child.elements.map(el => el.name);
        const uniqueNames = [...new Set(childNames)];
        
        if (uniqueNames.length === 1 && uniqueNames[0] !== undefined) {
          // Array of similar elements
          data[child.name] = child.elements.map(el => extractElementData(el));
        } else {
          // Nested object
          data[child.name] = extractElementData(child);
        }
      } else {
        data[child.name] = extractElementData(child);
      }
    } else if (child._text !== undefined) {
      // Text content
      data[child.name] = child._text;
    }
  });
  
  return data;
};

/**
 * Parse CSV file content
 * @param {String} content - CSV file content
 * @returns {Promise<Array>} Parsed products array
 */
export const parseCSV = async (content) => {
  return new Promise((resolve, reject) => {
    const products = [];
    
    const stream = Readable.from([content]);
    
    stream
      .pipe(parse({ headers: true, trim: true }))
      .on('data', (row) => {
        try {
          // Parse JSON strings back to objects
          const product = {
            ...row,
            assets: row.assets ? JSON.parse(row.assets) : [],
            categories: row.categories ? JSON.parse(row.categories) : [],
            attributes: row.attributes ? JSON.parse(row.attributes) : []
          };
          
          // Convert string numbers to proper types
          if (product.id) product.id = parseInt(product.id);
          if (product.attributeSetId) product.attributeSetId = parseInt(product.attributeSetId);
          
          products.push(product);
        } catch (error) {
          reject(new Error(`CSV row parsing error: ${error.message}`));
        }
      })
      .on('end', () => {
        if (products.length === 0) {
          reject(new Error('No products found in CSV'));
        } else {
          resolve(products);
        }
      })
      .on('error', (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      });
  });
};

/**
 * Detect file format from filename or content
 * @param {String} filename - Original filename
 * @param {String} content - File content (first 100 chars)
 * @returns {String} Detected format (json, xml, csv)
 */
export const detectFormat = (filename, content = '') => {
  // Try filename extension first
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['json', 'xml', 'csv'].includes(ext)) {
    return ext;
  }
  
  // Try content detection
  const trimmed = content.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<products')) return 'xml';
  
  // Default to CSV if comma separated
  if (trimmed.includes(',')) return 'csv';
  
  return 'json'; // Default
};

/**
 * Validate product data structure
 * @param {Object} product - Product data
 * @returns {Object} Validation result { valid: boolean, errors: [] }
 */
export const validateProductData = (product) => {
  const errors = [];
  
  // Required fields
  if (!product.sku || typeof product.sku !== 'string') {
    errors.push('SKU is required and must be a string');
  }
  
  if (!product.name || typeof product.name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  
  if (!product.productType) {
    errors.push('Product type is required');
  } else if (!['SIMPLE', 'CONFIGURABLE', 'BUNDLE', 'VIRTUAL', 'DOWNLOADABLE'].includes(product.productType)) {
    errors.push('Invalid product type. Must be SIMPLE, CONFIGURABLE, BUNDLE, VIRTUAL, or DOWNLOADABLE');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
