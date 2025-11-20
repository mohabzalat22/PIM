import {
  create,
  deleteById,
  deleteByCompositeKey,
  findAll,
  findById,
  update,
} from "../models/productAttributeModel.js";

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

  return res.success(productAttributeValues, "Product attributes retrieved successfully", meta);
};

export const getProductAttribute = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Product attribute ID is required");
  }
  const result = (await findById(id)) ?? [];
  return res.success(result, "Product attribute retrieved successfully");
};

export const createProductAttribute = async (req, res) => {
  const result = await create(req.body);
  return res.created(result, "Product attribute created successfully");
};

export const updateProductAttribute = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Product attribute ID is required");
  }
  try {
    const result = await update(id, req.body);
    return res.success(result, "Product attribute updated successfully");
  } catch (e) {
    return res.error("Failed to update product attribute", 400, {
      message: e.message,
    });
  }
};

export const deleteProductAttribute = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);

  if (!result) {
    return res.error("Failed to delete product attribute");
  }

  return res.success(result, "Product attribute deleted successfully");
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
      return res.error("Failed to delete product attribute");
    }

    return res.success(result, "Product attribute deleted successfully");
  } catch (e) {
    return res.error("Failed to delete product attribute", 400, {
      message: e.message,
    });
  }
};
