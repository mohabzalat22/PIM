import {
  findAll,
  findById,
  create,
  update,
  deleteById,
} from "../models/attributeGroupModel.js";
import { listByGroup } from "../models/attributeSetGroupAttributeModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

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

  return res.json(
    successMessage(groups, 200, "Success fetching attribute groups", meta)
  );
};

export const getAttributeGroup = async (req, res) => {
  const id = Number(req.params.id);
  const group = await findById(id);
  return res.json(successMessage(group));
};

export const createAttributeGroup = async (req, res) => {
  try {
    const result = await create(req.body);
    return res.json(successMessage(result, 200, "created attribute group"));
  } catch (e) {
    return res.json(
      errorMessage("couldnot create new attribute group", 300, {
        message: e.message,
        code: 800,
      })
    );
  }
};

export const updateAttributeGroup = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("undefined id"));
  }
  const result = await update(id, req.body);

  if (!result) {
    return res.json(errorMessage("couldnot update attribute group"));
  }
  return res.json(successMessage("updated attribute group"));
};

export const deleteAttributeGroup = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.json(errorMessage("couldnot delete attribute group"));
  }
  return res.json(successMessage("deleted attribute group"));
};

export const getAttributeGroupAttributes = async (req, res) => {
  const attributeGroupId = Number(req.params.id);

  if (!attributeGroupId) {
    return res.json(errorMessage("attribute group id not defined"));
  }

  const result = await listByGroup(attributeGroupId);
  return res.json(successMessage(result));
};
