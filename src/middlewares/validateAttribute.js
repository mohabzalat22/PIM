import z from "zod";
import { AttributeInputType, AttributeDataType } from "@prisma/client";
import { findById, findByCode } from "../models/attributeModel.js";

const attributeSchema = z.object({
  code: z.string().min(1, "Attribute code is required"),
  label: z.string().min(1, "Attribute label is required"),
  dataType: z.enum(Object.values(AttributeDataType), {
    errorMap: () => ({ message: "Invalid data type" }),
  }),
  inputType: z.enum(Object.values(AttributeInputType), {
    errorMap: () => ({ message: "Invalid input type" }),
  }),
  isRequired: z.boolean().optional().default(false),
  isFilterable: z.boolean().optional().default(false),
  isGlobal: z.boolean().optional().default(true),
});

export const validateAttributeCreation = async (req, res, next) => {
  const result = attributeSchema.safeParse(req.body);

  if (!result.success) {
    return res.error("Attribute validation failed. Please check the provided data.", 500, result.error);
  }

  // Check if already saved record with the same code
  const attributeExists = await findByCode(result.data.code);

  if (attributeExists) {
    return res.error(`An attribute with code '${result.data.code}' already exists in the system.`, 409, {
      error: `code-${result.data.code}`,
    });
  }

  next();
};

export const validateAttributeUpdate = async (req, res, next) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.error("Attribute ID is required and must be a valid number.", 500);
  }

  const attributeExists = await findById(id);

  if (!attributeExists) {
    return res.notFound(`Attribute with ID ${id} was not found in the system.`);
  }

  const result = attributeSchema.safeParse(req.body);

  if (!result.success) {
    return res.error("Attribute update validation failed. Please check the provided data.", 500, result.error);
  }

  // Check if code already exists (excluding current attribute)
  if (result.data.code) {
    const codeExists = await findByCode(result.data.code);
    if (codeExists && codeExists.id !== id) {
      return res.error(`Attribute code '${result.data.code}' is already in use by another attribute.`, 409);
    }
  }

  next();
};

export const validateAttributeDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const attributeExists = await findById(id);

  if (!id) {
    return res.error("Attribute ID is required and must be a valid number.", 500);
  }

  if (!attributeExists) {
    return res.notFound(`Attribute with ID ${id} was not found and cannot be deleted.`);
  }

  // Check if attribute has associated product attribute values
  if (
    attributeExists.productAttributeValues &&
    attributeExists.productAttributeValues.length > 0
  ) {
    return res.badRequest(
      `Cannot delete attribute '${attributeExists.label}' because it is currently associated with ${attributeExists.productAttributeValues.length} product(s).`
    );
  }

  next();
};
