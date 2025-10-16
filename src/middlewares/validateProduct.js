import z from "zod";
import { ProductType } from "@prisma/client";
import { errorMessage } from "../utils/message.js";
import { findById, findBySku } from "../models/productModel.js";

const productSchema = z.object({
  sku: z.string().min(1, "Product SKU is required"),
  type: z.enum(Object.values(ProductType), {
    errorMap: () => ({ message: "Invalid product type" }),
  }),
});

export const validateProductCreation = async (req, res, next) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate product", 500, result.error)
    );
  }

  // Check if already saved record with the same sku
  const productExists = await findBySku(result.data.sku);

  if (productExists) {
    return res.json(
      errorMessage("Product with the same SKU already exists", 409, {
        error: `sku-${result.data.sku}`,
      })
    );
  }
  next();
};

export const validateProductUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const result = productSchema.safeParse(req.body);
  const productExists = await findById(id);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate product update", 500, result.error)
    );
  }

  if (!productExists) {
    return res.json(errorMessage("Unable to find product to update", 404));
  }

  // Check if SKU already exists (excluding current product)
  if (result.data.sku) {
    const skuExists = await findBySku(result.data.sku);
    if (skuExists && skuExists.id !== id) {
      return res.json(
        errorMessage("Product with the same SKU already exists", 409)
      );
    }
  }

  next();
};

export const validateProductDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const productExists = await findById(id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  if (!productExists) {
    return res.json(errorMessage("Unable to find product to delete", 404));
  }

  // Check if product has associated data
  if (productExists.productAssets && productExists.productAssets.length > 0) {
    return res.json(
      errorMessage("Cannot delete product with associated assets", 400)
    );
  }

  if (
    productExists.productCategories &&
    productExists.productCategories.length > 0
  ) {
    return res.json(
      errorMessage("Cannot delete product with associated categories", 400)
    );
  }

  if (
    productExists.productAttributeValues &&
    productExists.productAttributeValues.length > 0
  ) {
    return res.json(
      errorMessage(
        "Cannot delete product with associated attribute values",
        400
      )
    );
  }

  next();
};
