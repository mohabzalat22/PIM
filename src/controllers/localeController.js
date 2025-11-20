import { findAll, findById, create, update, deleteById } from "../models/localeModel.js";

export const getLocales = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const filters = {
    search: req.query.search || null,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "desc",
  };

  const [locales, total] = (await findAll(skip, limit, filters)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  res.success(locales, "Locales retrieved successfully", meta);
};

export const getLocale = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Locale ID is required");
  }
  const locale = (await findById(id)) ?? {};
  res.success(locale, "Locale retrieved successfully");
};

export const createLocale = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.error("Failed to create new locale", 500);
  }
  res.created(result, "Locale created successfully");
};

export const updateLocale = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.error("Failed to update locale");
  }
  res.success(result, "Locale updated successfully");
};

export const deleteLocale = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.error("Failed to delete locale");
  }
  res.success(result, "Locale deleted successfully");
};
