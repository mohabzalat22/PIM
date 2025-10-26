import {
  create,
  deleteById,
  deleteByCompositeKey,
  findAll,
  findById,
  update,
} from "../models/productAttributeModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

export const getProductAttributes = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // current page
  const limit = parseInt(req.query.limit) || 10; // items per page
  const skip = (page - 1) * limit;

  // Extract filter parameters
  const filters = {
    search: req.query.search || null,
    productId: req.query.productId || null,
    attributeId: req.query.attributeId || null,
    storeViewId: req.query.storeViewId || null,
    dataType: req.query.dataType || null,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder || 'desc'
  };

  const [productAttributeValues, total] = (await findAll(skip, limit, filters)) ?? [];

  // meta data
  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return res.json(successMessage(productAttributeValues, 200, "Success fetching product attributes", meta));
};

export const getProductAttribute = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("undefined product attribute id"));
  }
  const result = (await findById(id)) ?? [];
  return res.json(successMessage(result));
};

export const createProductAttribute = async (req, res) => {
  const result = await create(req.body);
  return res.json(
    successMessage(result, "created product attribute successfully")
  );
};

export const updateProductAttribute = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("undefined id for updaing product attribute"));
  }
  try {
    const result = await update(id, req.body);
    return res.json(
      successMessage(result, "updated product attribute successfully")
    );
  } catch (e) {
    return res.json(
      errorMessage("error when updating product attribute", 400, {
        message: e.message,
      })
    );
  }
};

export const deleteProductAttribute = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);

  if (!result) {
    return res.json(errorMessage("cannot delete product attribute"));
  }

  return res.json(successMessage("deleted product successfully"));
};

export const deleteProductAttributeByCompositeKey = async (req, res) => {
  const productId = Number(req.params.productId);
  const attributeId = Number(req.params.attributeId);
  const storeViewId = req.params.storeViewId
    ? Number(req.params.storeViewId)
    : null;

  try {
    const result = await deleteByCompositeKey(
      productId,
      attributeId,
      storeViewId
    );

    if (!result) {
      return res.json(errorMessage("Cannot delete product attribute"));
    }

    return res.json(successMessage("Product attribute deleted successfully"));
  } catch (e) {
    return res.json(
      errorMessage("Error when deleting product attribute", 400, {
        message: e.message,
      })
    );
  }
};
