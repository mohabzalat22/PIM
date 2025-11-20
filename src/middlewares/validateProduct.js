import z from "zod";
import { ProductType } from "@prisma/client";
import { findById, findBySku } from "../models/productModel.js";

const productSchema = z.object({
  sku: z.string().min(1, "Product SKU is required"),
  type: z.enum(Object.values(ProductType), {
    errorMap: () => ({ message: "Invalid product type" }),
  }),
});

const productUpdateSchema = z.object({
  sku: z.string().min(1, "Product SKU is required").optional(),
  type: z.enum(Object.values(ProductType), {
    errorMap: () => ({ message: "Invalid product type" }),
  }).optional(),
  attributeSetId: z.number().nullable().optional(),
});

export const validateProductCreation = async (req, res, next) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    return res.error("Product validation failed. Please check the provided data.", 500, result.error);
  }

  // Check if already saved record with the same sku
  const productExists = await findBySku(result.data.sku);

  if (productExists) {
    return res.error(`A product with SKU '${result.data.sku}' already exists in the system.`, 409, {
      error: `sku-${result.data.sku}`,
    });
  }
  next();
};

export const validateProductUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.error("Product ID is required and must be a valid number.", 500);
  }

  const result = productUpdateSchema.safeParse(req.body);
  const productExists = await findById(id);

  if (!result.success) {
    return res.error("Product update validation failed. Please check the provided data.", 500, result.error);
  }

  if (!productExists) {
    return res.notFound(`Product with ID ${id} was not found in the system.`);
  }

  // Check if SKU already exists (excluding current product)
  if (result.data.sku) {
    const skuExists = await findBySku(result.data.sku);
    if (skuExists && skuExists.id !== id) {
      return res.error(`SKU '${result.data.sku}' is already in use by another product.`, 409);
    }
  }

  next();
};

export const validateProductDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const productExists = await findById(id);

  if (!id) {
    return res.error("Product ID is required and must be a valid number.", 500);
  }

  if (!productExists) {
    return res.notFound(`Product with ID ${id} was not found and cannot be deleted.`);
  }

  next();
};
