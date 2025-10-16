import z from "zod";
import { errorMessage } from "../utils/message.js";
import { findById as findProductById } from "../models/productModel.js";
import { findById as findAttributeById } from "../models/attributeModel.js";
import { findById as findStoreViewById } from "../models/storeViewModel.js";
import {
  findById,
  findByCompositeKey,
} from "../models/productAttributeModel.js";

const ProductAttributeValueSchema = z
  .object({
    productId: z
      .number()
      .int()
      .positive("Product ID must be a positive integer"),
    attributeId: z
      .number()
      .int()
      .positive("Attribute ID must be a positive integer"),
    storeViewId: z.number().int().positive().nullable().optional(),
    valueString: z.string().optional(),
    valueInt: z.number().int().optional(),
    valueDecimal: z.number().optional(),
    valueText: z.string().optional(),
    valueBoolean: z.boolean().optional(),
    valueJson: z.any().optional(),
  })
  .refine(
    (data) => {
      // Ensure at least one value field is provided
      const valueFields = [
        data.valueString,
        data.valueInt,
        data.valueDecimal,
        data.valueText,
        data.valueBoolean,
        data.valueJson,
      ];
      return valueFields.some((field) => field !== undefined && field !== null);
    },
    {
      message: "At least one value field must be provided",
    }
  );

export const validateProductAttributeCreation = async (req, res, next) => {
  const result = ProductAttributeValueSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate product attribute", 500, result.error)
    );
  }

  // Check if product exists
  const productId = req.body.productId;
  const product = await findProductById(productId);
  if (!product) {
    return res.json(errorMessage("Product not found", 404));
  }

  // Check if attribute exists
  const attributeId = req.body.attributeId;
  const attribute = await findAttributeById(attributeId);
  if (!attribute) {
    return res.json(errorMessage("Attribute not found", 404));
  }

  // Check if storeView exists when storeViewId is provided
  const storeViewId = req.body.storeViewId;
  if (storeViewId !== null && storeViewId !== undefined) {
    const storeView = await findStoreViewById(storeViewId);
    if (!storeView) {
      return res.json(errorMessage("Store view not found", 404));
    }
  }

  next();
};

export const validateProductAttributeUpdate = async (req, res, next) => {
  // For updates, make all fields optional except for value fields
  const ProductAttributeUpdateSchema = z
    .object({
      productId: z.number().int().positive().optional(),
      attributeId: z.number().int().positive().optional(),
      storeViewId: z.number().int().positive().nullable().optional(),
      valueString: z.string().optional(),
      valueInt: z.number().int().optional(),
      valueDecimal: z.number().optional(),
      valueText: z.string().optional(),
      valueBoolean: z.boolean().optional(),
      valueJson: z.any().optional(),
    })
    .refine(
      (data) => {
        // Ensure at least one value field is provided
        const valueFields = [
          data.valueString,
          data.valueInt,
          data.valueDecimal,
          data.valueText,
          data.valueBoolean,
          data.valueJson,
        ];
        return valueFields.some(
          (field) => field !== undefined && field !== null
        );
      },
      {
        message: "At least one value field must be provided",
      }
    );

  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const productAttributeExists = await findById(id);
  if (!productAttributeExists) {
    return res.json(
      errorMessage("Unable to find product attribute value to update", 404)
    );
  }

  const result = ProductAttributeUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage(
        "Failed to validate product attribute update",
        500,
        result.error
      )
    );
  }

  // Check if product exists (only if productId is provided)
  if (req.body.productId) {
    const product = await findProductById(req.body.productId);
    if (!product) {
      return res.json(errorMessage("Product not found", 404));
    }
  }

  // Check if attribute exists (only if attributeId is provided)
  if (req.body.attributeId) {
    const attribute = await findAttributeById(req.body.attributeId);
    if (!attribute) {
      return res.json(errorMessage("Attribute not found", 404));
    }
  }

  // Check if storeView exists when storeViewId is provided
  if (req.body.storeViewId !== null && req.body.storeViewId !== undefined) {
    const storeView = await findStoreViewById(req.body.storeViewId);
    if (!storeView) {
      return res.json(errorMessage("Store view not found", 404));
    }
  }

  next();
};

export const validateProductAttributeDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const productAttributeExists = await findById(id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  if (!productAttributeExists) {
    return res.json(
      errorMessage("Unable to find product attribute value to delete", 404)
    );
  }

  next();
};

export const validateProductAttributeDeleteByCompositeKey = async (
  req,
  res,
  next
) => {
  const productId = Number(req.params.productId);
  const attributeId = Number(req.params.attributeId);
  const storeViewId = req.params.storeViewId
    ? Number(req.params.storeViewId)
    : null;

  if (!productId) {
    return res.json(errorMessage("Product ID not defined"));
  }

  if (!attributeId) {
    return res.json(errorMessage("Attribute ID not defined"));
  }

  // Check if product exists
  const productExists = await findProductById(productId);
  if (!productExists) {
    return res.json(errorMessage("Product not found", 404));
  }

  // Check if attribute exists
  const attributeExists = await findAttributeById(attributeId);
  if (!attributeExists) {
    return res.json(errorMessage("Attribute not found", 404));
  }

  // Check if storeView exists when storeViewId is provided
  if (storeViewId !== null && storeViewId !== undefined) {
    const storeViewExists = await findStoreViewById(storeViewId);
    if (!storeViewExists) {
      return res.json(errorMessage("Store view not found", 404));
    }
  }

  // Check if the product attribute value exists
  const productAttributeExists = await findByCompositeKey(
    productId,
    attributeId,
    storeViewId
  );
  if (!productAttributeExists) {
    return res.json(
      errorMessage(
        "Unable to find product attribute value with the specified combination",
        404
      )
    );
  }

  next();
};
