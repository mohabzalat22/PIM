import {
  findAll,
  findById,
  create,
  update,
  deleteById,
} from "../models/attributeGroupModel.js";
import { listByGroup } from "../models/attributeSetGroupAttributeModel.js";

export const getAttributeGroups = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {
    search: req.query.search || null,
    attributeSetId: req.query.attributeSetId || null,
    sortBy: req.query.sortBy || "sortOrder",
    sortOrder: req.query.sortOrder || "asc",
  };

  const [groups, total] = (await findAll(skip, limit, filters)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return res.success(groups, "Attribute groups retrieved successfully", meta);
};

export const getAttributeGroup = async (req, res) => {
  const id = Number(req.params.id);
  const group = await findById(id);
  return res.success(group, "Attribute group retrieved successfully");
};

export const createAttributeGroup = async (req, res) => {
  try {
    const result = await create(req.body);
    return res.created(result, "Attribute group created successfully");
  } catch (e) {
    return res.error("Failed to create attribute group", 500, {
      message: e.message,
      code: 800,
    });
  }
};

export const updateAttributeGroup = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Attribute group ID is required");
  }
  const result = await update(id, req.body);

  if (!result) {
    return res.error("Failed to update attribute group");
  }
  return res.success(result, "Attribute group updated successfully");
};

export const deleteAttributeGroup = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete attribute group");
  }
  return res.success(result, "Attribute group deleted successfully");
};

export const getAttributeGroupAttributes = async (req, res) => {
  const attributeGroupId = Number(req.params.id);

  if (!attributeGroupId) {
    return res.badRequest("Attribute group ID is required");
  }

  const result = await listByGroup(attributeGroupId);
  return res.success(result, "Attribute group attributes retrieved successfully");
};
