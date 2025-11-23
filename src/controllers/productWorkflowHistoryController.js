import {
  findByProductId,
  findAll,
} from "../models/productWorkflowHistoryModel.js";

export const getProductWorkflowHistory = async (req, res) => {
  const productId = Number(req.params.productId);
  
  if (!productId) {
    return res.badRequest("Product ID is required");
  }

  const history = await findByProductId(productId);
  res.success(history, "Workflow history retrieved successfully");
};

export const getAllWorkflowHistory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const filters = {
    productId: req.query.productId || null,
    changedById: req.query.changedById || null,
  };

  const [history, total] = (await findAll(skip, limit, filters)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(history, "Workflow history retrieved successfully", meta);
};
