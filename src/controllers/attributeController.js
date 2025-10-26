import {
  create,
  deleteById,
  findAll,
  findById,
  update,
} from "../models/attributeModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

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
  
  return res.json(successMessage(attributes, 200, "Success fetching attributes", meta));
};

export const getAttribute = async (req, res) => {
  const id = Number(req.params.id);
  const attribute = await findById(id);
  return res.json(successMessage(attribute));
};

export const createAttribute = async (req, res) => {
  try {
    const result = await create(req.body);
    return res.json(successMessage(result, 200, "created attribute"));
  } catch (e) {
    return res.json(
      errorMessage("couldnot create new attribute", 300, {
        message: e.message,
        code: 800,
      })
    );
  }
};

export const updateAttribute = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("undefined id"));
  }
  const result = await update(id, req.body);

  if (!result) {
    return res.json(errorMessage("couldnot update attribute"));
  }
  return res.json(successMessage("updated attribute"));
};

export const deleteAttribute = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.json(errorMessage("couldnot delete attribute"));
  }
  return res.json(successMessage("deleted attribute"));
};
