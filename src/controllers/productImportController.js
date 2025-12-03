import * as productModel from "../models/productModel.js";
import {
  parseJSON,
  parseXML,
  parseCSV,
  detectFormat,
} from "../utils/importParser.js";
import { validateProductData } from "../middlewares/validateProductImport.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Import products from uploaded file
 * @route POST /api/products/import
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      console.error("[Import] No file uploaded");
      return res.error("No file uploaded", 400);
    }

    const fileContent = req.file.buffer.toString("utf-8");
    const filename = req.file.originalname;
    console.log(`[Import] Processing file: ${filename}, size: ${req.file.size} bytes`);

    // Detect format
    const format = detectFormat(filename, fileContent);
    console.log(`[Import] Detected format: ${format}`);

    // Parse file based on format
    let products;
    try {
      switch (format) {
        case "json":
          products = await parseJSON(fileContent);
          break;
        case "xml":
          products = await parseXML(fileContent);
          break;
        case "csv":
          products = await parseCSV(fileContent);
          break;
        default:
          console.error(`[Import] Unsupported format: ${format}`);
          return res.error(`Unsupported format: ${format}`, 400);
      }
      console.log(`[Import] Parsed ${products?.length || 0} products from file`);
    } catch (parseError) {
      console.error(`[Import] Parse error:`, parseError);
      return res.error(`Parse error: ${parseError.message}`, 400);
    }

    // Validate products data
    const validationResults = validateProductData(products);
    console.log(`[Import] Validation results: ${validationResults.valid.length} valid, ${validationResults.invalid.length} invalid`);

    if (validationResults.invalid.length > 0 && validationResults.valid.length === 0) {
      console.error("[Import] All products have validation errors:", validationResults.invalid);
      return res.error("All products have validation errors", 400, {
        errors: validationResults.invalid,
      });
    }

    // Import valid products
    const importResults = {
      total: products.length,
      successful: 0,
      failed: 0,
      updated: 0,
      created: 0,
      errors: [],
      skipped: validationResults.invalid.length,
    };

    // Process each valid product
    for (const { index, data } of validationResults.valid) {
      try {
        await prisma.$transaction(async (tx) => {
          // Check if product exists by SKU
          const existingProduct = await tx.product.findUnique({
            where: { sku: data.sku },
          });

          let product;
          
          // Prepare product data
          const productData = {
            sku: data.sku,
            name: data.name,
            description: data.description || null,
            productType: data.productType,
            attributeSetId: data.attributeSetId || null,
          };

          if (existingProduct) {
            // Update existing product
            product = await tx.product.update({
              where: { id: existingProduct.id },
              data: productData,
            });
            importResults.updated++;
          } else {
            // Create new product
            product = await tx.product.create({
              data: productData,
            });
            importResults.created++;
          }

          // Handle product assets (from CSV flattened format or nested format)
          const assets = data.assets || data.productAssets || [];
          if (assets.length > 0) {
            // Delete existing product assets for update
            if (existingProduct) {
              await tx.productAsset.deleteMany({
                where: { productId: product.id },
              });
            }

            // Create new product assets
            for (const assetData of assets) {
              // Check if asset exists or create it
              let asset;
              if (assetData.assetId) {
                asset = await tx.asset.findUnique({
                  where: { id: assetData.assetId },
                });
              } else if (assetData.url) {
                // Try to find asset by URL or create new one
                asset = await tx.asset.findFirst({
                  where: { url: assetData.url },
                });

                if (!asset && assetData.asset) {
                  // Create asset from nested data
                  asset = await tx.asset.create({
                    data: {
                      url: assetData.asset.url || assetData.url,
                      type: assetData.asset.type || "IMAGE",
                    },
                  });
                }
              }

              if (asset) {
                await tx.productAsset.create({
                  data: {
                    productId: product.id,
                    assetId: asset.id,
                    type: assetData.type || "image",
                    position: assetData.position || 0,
                  },
                });
              }
            }
          }

          // Handle product categories (from CSV flattened format or nested format)
          const categories = data.categories || data.productCategories || [];
          if (categories.length > 0) {
            // Delete existing product categories for update
            if (existingProduct) {
              await tx.productCategory.deleteMany({
                where: { productId: product.id },
              });
            }

            // Create new product categories
            for (const categoryData of categories) {
              const categoryId =
                categoryData.categoryId || categoryData.category?.id;
              if (categoryId) {
                // Check if category exists
                const category = await tx.category.findUnique({
                  where: { id: categoryId },
                });

                if (category) {
                  await tx.productCategory.create({
                    data: {
                      productId: product.id,
                      categoryId: category.id,
                    },
                  });
                }
              }
            }
          }

          // Handle product attributes (from CSV flattened format or nested format)
          const attributes = data.attributes || data.productAttributeValues || [];
          if (attributes.length > 0) {
            // Delete existing product attribute values for update
            if (existingProduct) {
              await tx.productAttributeValue.deleteMany({
                where: { productId: product.id },
              });
            }

            // Create new product attribute values
            for (const attrData of attributes) {
              const attributeCode =
                attrData.attributeCode || attrData.attribute?.code;
              
              if (attributeCode) {
                // Find attribute by code
                const attribute = await tx.attribute.findUnique({
                  where: { code: attributeCode },
                });

                if (attribute) {
                  await tx.productAttributeValue.create({
                    data: {
                      productId: product.id,
                      attributeId: attribute.id,
                      storeViewId: attrData.storeViewId || null,
                      valueString: attrData.valueString || null,
                      valueInt: attrData.valueInt || null,
                      valueDecimal: attrData.valueDecimal
                        ? parseFloat(attrData.valueDecimal)
                        : null,
                      valueBoolean: attrData.valueBoolean || null,
                      valueText: attrData.valueText || null,
                      valueJson: attrData.valueJson || null,
                    },
                  });
                }
              }
            }
          }

          importResults.successful++;
        });
      } catch (importError) {
        console.error(`[Import] Error importing product ${data.sku}:`, importError);
        importResults.failed++;
        importResults.errors.push({
          sku: data.sku,
          index,
          error: importError.message,
        });
      }
    }

    console.log(`[Import] Import completed:`, importResults);

    // Return import summary
    return res.success(
      {
        summary: importResults,
        validationErrors: validationResults.invalid,
      },
      `Import completed: ${importResults.successful} successful, ${importResults.failed} failed, ${importResults.skipped} skipped`
    );
  } catch (error) {
    console.error("[Import] Fatal error:", error);
    return res.error(`Failed to import products: ${error.message}`, 500);
  }
};
