import z from "zod";
import { ProductType } from "@prisma/client";
import { errorMessage } from "../utils/message.js";
import { findById as findAttributeSetById } from "../models/attributeSetModel.js";
import { findById as findAttributeGroupById } from "../models/attributeGroupModel.js";
import { findById as findAttributeById } from "../models/attributeModel.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const attributeSetSchema = z.object({
  code: z.string().min(1, "Attribute set code is required"),
  label: z.string().min(1, "Attribute set label is required"),
  productType: z
    .enum(Object.values(ProductType), {
      errorMap: () => ({ message: "Invalid product type" }),
    })
    .nullable()
    .optional(),
  isDefault: z.boolean().optional(),
  attributes: z
    .array(
      z.object({
        attributeId: z.number().int().positive(),
        sortOrder: z.number().int().optional(),
      })
    )
    .optional(),
  groups: z
    .array(
      z.object({
        code: z.string().min(1),
        label: z.string().min(1),
        sortOrder: z.number().int().optional(),
        attributes: z
          .array(
            z.object({
              attributeId: z.number().int().positive(),
              sortOrder: z.number().int().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

export const validateAttributeSetCreation = async (req, res, next) => {
  const result = attributeSetSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate attribute set", 500, result.error)
    );
  }

  const existing = await prisma.attributeSet.findUnique({
    where: { code: result.data.code },
  });

  if (existing) {
    return res.json(
      errorMessage("Attribute set with the same code already exists", 409, {
        error: `code-${result.data.code}`,
      })
    );
  }

  const attributeIds = new Set();

  if (result.data.attributes) {
    for (const item of result.data.attributes) {
      const attribute = await findAttributeById(item.attributeId);
      if (!attribute) {
        return res.json(errorMessage("Attribute not found", 404));
      }

      if (attributeIds.has(item.attributeId)) {
        return res.json(
          errorMessage(
            "Attribute cannot be duplicated in the same attribute set",
            400
          )
        );
      }
      attributeIds.add(item.attributeId);
    }
  }

  if (result.data.groups) {
    for (const group of result.data.groups) {
      if (group.attributes) {
        for (const attr of group.attributes) {
          const attribute = await findAttributeById(attr.attributeId);
          if (!attribute) {
            return res.json(errorMessage("Attribute not found", 404));
          }

          if (attributeIds.has(attr.attributeId)) {
            return res.json(
              errorMessage(
                "Attribute cannot be duplicated in the same attribute set",
                400
              )
            );
          }
          attributeIds.add(attr.attributeId);
        }
      }
    }
  }

  next();
};

export const validateAttributeSetUpdate = async (req, res, next) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const attributeSetExists = await findAttributeSetById(id);

  if (!attributeSetExists) {
    return res.json(
      errorMessage("Unable to find attribute set to update", 404)
    );
  }

  const result = attributeSetSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate attribute set update", 500, result.error)
    );
  }

  if (result.data.code) {
    const codeExists = await prisma.attributeSet.findUnique({
      where: { code: result.data.code },
    });
    if (codeExists && codeExists.id !== id) {
      return res.json(
        errorMessage("Attribute set with the same code already exists", 409)
      );
    }
  }

  next();
};

export const validateAttributeSetDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const attributeSetExists = await findAttributeSetById(id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  if (!attributeSetExists) {
    return res.json(
      errorMessage("Unable to find attribute set to delete", 404)
    );
  }

  next();
};

const attributeGroupSchema = z.object({
  attributeSetId: z.number().int().positive(),
  code: z.string().min(1, "Attribute group code is required"),
  label: z.string().min(1, "Attribute group label is required"),
  sortOrder: z.number().int().optional(),
});

export const validateAttributeGroupCreation = async (req, res, next) => {
  const result = attributeGroupSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate attribute group", 500, result.error)
    );
  }

  const attributeSet = await findAttributeSetById(result.data.attributeSetId);
  if (!attributeSet) {
    return res.json(errorMessage("Attribute set not found", 404));
  }

  const existingGroup = await prisma.attributeGroup.findFirst({
    where: {
      attributeSetId: result.data.attributeSetId,
      code: result.data.code,
    },
  });

  if (existingGroup) {
    return res.json(
      errorMessage("Attribute group with the same code already exists", 409)
    );
  }

  next();
};

export const validateAttributeGroupUpdate = async (req, res, next) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const attributeGroupExists = await findAttributeGroupById(id);

  if (!attributeGroupExists) {
    return res.json(
      errorMessage("Unable to find attribute group to update", 404)
    );
  }

  const result = attributeGroupSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate attribute group update", 500, result.error)
    );
  }

  if (result.data.code) {
    const existingGroup = await prisma.attributeGroup.findFirst({
      where: {
        attributeSetId: result.data.attributeSetId,
        code: result.data.code,
      },
    });

    if (existingGroup && existingGroup.id !== id) {
      return res.json(
        errorMessage("Attribute group with the same code already exists", 409)
      );
    }
  }

  next();
};

export const validateAttributeGroupDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  const attributeGroupExists = await findAttributeGroupById(id);

  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  if (!attributeGroupExists) {
    return res.json(
      errorMessage("Unable to find attribute group to delete", 404)
    );
  }

  next();
};
