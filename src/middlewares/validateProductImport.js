import { z } from "zod";

// Zod schema for product import validation
const productImportSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  productType: z.enum(
    ["SIMPLE", "CONFIGURABLE", "BUNDLE", "VIRTUAL", "DOWNLOADABLE"],
    {
      errorMap: () => ({ message: "Invalid product type" }),
    }
  ),
  attributeSetId: z.number().int().positive().optional(),
  // Optional relations
  productAssets: z.array(z.any()).optional(),
  productCategories: z.array(z.any()).optional(),
  productAttributeValues: z.array(z.any()).optional(),
  assets: z.array(z.any()).optional(), // Flattened from CSV
  categories: z.array(z.any()).optional(), // Flattened from CSV
  attributes: z.array(z.any()).optional(), // Flattened from CSV
});

/**
 * Validate file upload
 */
export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.error("No file uploaded", 400);
  }

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  if (req.file.size > maxSize) {
    return res.error("File too large. Maximum size is 50MB", 400);
  }

  // Check file extension
  const allowedExtensions = [".json", ".xml", ".csv"];
  const filename = req.file.originalname.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) =>
    filename.endsWith(ext)
  );

  if (!hasValidExtension) {
    return res.error(
      `Invalid file type. Allowed types: ${allowedExtensions.join(", ")}`,
      400
    );
  }

  next();
};

/**
 * Validate product data structure
 */
export const validateProductData = (products) => {
  const results = {
    valid: [],
    invalid: [],
  };

  if (!Array.isArray(products)) {
    return {
      valid: [],
      invalid: [{
        index: 0,
        sku: 'N/A',
        errors: [{ field: 'products', message: 'Products must be an array' }]
      }]
    };
  }

  products.forEach((product, index) => {
    const result = productImportSchema.safeParse(product);

    if (result.success) {
      results.valid.push({
        index,
        data: result.data,
      });
    } else {
      results.invalid.push({
        index,
        sku: product?.sku || `Unknown (row ${index + 1})`,
        errors: result.error?.errors?.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })) || [{ field: 'unknown', message: 'Validation error' }],
      });
    }
  });

  return results;
};
