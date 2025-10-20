import {
  findAll,
  create,
  update,
  deleteById,
  findById,
} from "../models/productModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // current page
  const limit = parseInt(req.query.limit) || 10; // items per page
  const skip = (page - 1) * limit;

  const [products, total] = (await findAll(skip, limit)) ?? [];

  // meta data
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.json(successMessage(products, 200, "Success fetching products", meta));
};

export const getProduct = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    res.json(errorMessage("Id not found"));
  }
  const product = (await findById(id)) ?? [];
  res.json(successMessage(product));
};

export const createProduct = async (req, res) => {
  const result = create(req.body);
  if (!result) {
    res.json(errorMessage("Failed to create new product", 500, result.error));
  }
  res.json(successMessage(result));
};

export const updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    res.json(errorMessage("Failed to update product"));
  }
  res.json(successMessage("Product updated successfully"));
};

export const deleteProduct = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    res.json(errorMessage("Failed to created product"));
  }
  res.json(successMessage("Product deleted successfully"));
};
