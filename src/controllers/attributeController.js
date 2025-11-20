import {
  create,
  deleteById,
  findAll,
  findById,
  update,
} from "../models/attributeModel.js";

export const getAttributes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filters = {
    search: req.query.search || null,
    dataType: req.query.dataType || null,
    inputType: req.query.inputType || null,
    isFilterable: req.query.isFilterable || null,
    isGlobal: req.query.isGlobal || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [attributes, total] = (await findAll(skip, limit, filters)) ?? [];
  
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
  
  return res.success(attributes, "Attributes retrieved successfully", meta);
};

export const getAttribute = async (req, res) => {
  const id = Number(req.params.id);
  const attribute = await findById(id);
  return res.success(attribute, "Attribute retrieved successfully");
};

export const createAttribute = async (req, res) => {
  try {
    const result = await create(req.body);
    return res.created(result, "Attribute created successfully");
  } catch (e) {
    return res.error("Failed to create attribute", 500, {
      message: e.message,
      code: 800,
    });
  }
};

export const updateAttribute = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Attribute ID is required");
  }
  const result = await update(id, req.body);

  if (!result) {
    return res.error("Failed to update attribute");
  }
  return res.success(result, "Attribute updated successfully");
};

export const deleteAttribute = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete attribute");
  }
  return res.success(result, "Attribute deleted successfully");
};
