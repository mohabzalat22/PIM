import {
  findAll,
  findById,
  create,
  update,
  deleteById,
} from "../models/attributeSetModel.js";
import { addAttributeToSet, removeAttributeFromSet } from "../models/attributeSetAttributeModel.js";
import { addAttributeToGroup, removeAttributeFromGroup } from "../models/attributeSetGroupAttributeModel.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAttributeSets = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {
    search: req.query.search || null,
    productType: req.query.productType || null,
    isDefault: req.query.isDefault || null,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "desc",
  };

  const [sets, total] = (await findAll(skip, limit, filters)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return res.success(sets, "Attribute sets retrieved successfully", meta);
};

export const getAttributeSet = async (req, res) => {
  const id = Number(req.params.id);
  const set = await findById(id);
  return res.success(set, "Attribute set retrieved successfully");
};

export const createAttributeSet = async (req, res) => {
  try {
    const result = await create(req.body);
    return res.created(result, "Attribute set created successfully");
  } catch (e) {
    return res.error("Failed to create attribute set", 500, {
      message: e.message,
      code: 800,
    });
  }
};

export const updateAttributeSet = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Attribute set ID is required");
  }
  const result = await update(id, req.body);

  if (!result) {
    return res.error("Failed to update attribute set");
  }
  return res.success(result, "Attribute set updated successfully");
};

export const deleteAttributeSet = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete attribute set");
  }
  return res.success(result, "Attribute set deleted successfully");
};

export const addAttributeToAttributeSet = async (req, res) => {
  const attributeSetId = Number(req.params.id);
  const { attributeId, sortOrder } = req.body;

  if (!attributeSetId || !attributeId) {
    return res.badRequest("Attribute set ID and attribute ID are required");
  }

  // Do not allow assigning an attribute directly to a set
  // if it is already assigned to any group in the same set
  const existingInGroups = await prisma.attributeSetGroupAttribute.findFirst({
    where: {
      attributeSetId,
      attributeId,
    },
  });

  if (existingInGroups) {
    return res.badRequest(
      "Attribute is already assigned to a group in this attribute set"
    );
  }

  const result = await addAttributeToSet({
    attributeSetId,
    attributeId,
    sortOrder,
  });

  return res.success(result, "Attribute added to set successfully");
};

export const removeAttributeFromAttributeSet = async (req, res) => {
  const id = Number(req.params.relationId);
  if (!id) {
    return res.badRequest("Relation ID is required");
  }

  const result = await removeAttributeFromSet(id);
  if (!result) {
    return res.error("Failed to remove attribute from set");
  }

  return res.success(result, "Attribute removed from set successfully");
};

export const addAttributeToAttributeGroupInSet = async (req, res) => {
  const attributeSetId = Number(req.params.id);
  const attributeGroupId = Number(req.params.groupId);
  const { attributeId, sortOrder } = req.body;

  if (!attributeSetId || !attributeGroupId || !attributeId) {
    return res.badRequest(
      "Attribute set ID, attribute group ID and attribute ID are required"
    );
  }

  // Do not allow assigning an attribute to a group if it is
  // already assigned directly to the set
  const existingInSet = await prisma.attributeSetAttribute.findFirst({
    where: {
      attributeSetId,
      attributeId,
    },
  });

  if (existingInSet) {
    return res.badRequest(
      "Attribute is already assigned directly to this attribute set"
    );
  }

  // Additionally, prevent assigning the same attribute to more than
  // one group within the same set (in case DB constraint changes)
  const existingInOtherGroup = await prisma.attributeSetGroupAttribute.findFirst({
    where: {
      attributeSetId,
      attributeId,
    },
  });

  if (existingInOtherGroup) {
    return res.badRequest(
      "Attribute is already assigned to another group in this attribute set"
    );
  }

  const result = await addAttributeToGroup({
    attributeSetId,
    attributeGroupId,
    attributeId,
    sortOrder,
  });

  return res.success(
    result,
    "Attribute added to group successfully"
  );
};

export const removeAttributeFromAttributeGroupInSet = async (req, res) => {
  const id = Number(req.params.relationId);
  if (!id) {
    return res.badRequest("Relation ID is required");
  }

  const result = await removeAttributeFromGroup(id);
  if (!result) {
    return res.error(
      "Failed to remove attribute from group"
    );
  }

  return res.success(result, "Attribute removed from group successfully");
};
