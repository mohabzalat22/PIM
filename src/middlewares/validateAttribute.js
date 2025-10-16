import z from "zod";
import { AttributeInputType, AttributeDataType } from "@prisma/client";
import { errorMessage } from "../utils/message.js";
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
    return res.json(
      errorMessage("Failed to validate attribute", 500, result.error)
    );
  }

  // Check if already saved record with the same code
  const attributeExists = await findByCode(result.data.code);

  if (attributeExists) {
    return res.json(
      errorMessage("Attribute with the same code already exists", 409, {
        error: `code-${result.data.code}`,
      })
    );
  }

  next();
};

export const validateAttributeUpdate = async (req, res, next) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const attributeExists = await findById(id);

  if (!attributeExists) {
    return res.json(errorMessage("Unable to find attribute to update", 404));
  }

  const result = attributeSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate attribute update", 500, result.error)
    );
  }

  // Check if code already exists (excluding current attribute)
  if (result.data.code) {
    const codeExists = await findByCode(result.data.code);
    if (codeExists && codeExists.id !== id) {
      return res.json(
        errorMessage("Attribute with the same code already exists", 409)
      );
    }
  }

  next();
};

export const validateAttributeDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const attributeExists = await findById(id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  if (!attributeExists) {
    return res.json(errorMessage("Unable to find attribute to delete", 404));
  }

  // Check if attribute has associated product attribute values
  if (
    attributeExists.productAttributeValues &&
    attributeExists.productAttributeValues.length > 0
  ) {
    return res.json(
      errorMessage(
        "Cannot delete attribute with associated product attribute values",
        400
      )
    );
  }

  next();
};
