import { findAll, findById, create, update, deleteById } from "../models/localeModel.js";
import { errorMessage, successMessage } from "../utils/message.js";

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

  res.json(successMessage(locales, 200, "Success fetching locales", meta));
};

export const getLocale = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("ID not found"));
  }
  const locale = (await findById(id)) ?? {};
  res.json(successMessage(locale));
};

export const createLocale = async (req, res) => {
  const result = await create(req.body);
  if (!result) {
    return res.json(errorMessage("Failed to create new locale", 500));
  }
  res.json(successMessage(result));
};

export const updateLocale = async (req, res) => {
  const id = Number(req.params.id);
  const result = await update(id, req.body);
  if (!result) {
    return res.json(errorMessage("Failed to update locale"));
  }
  res.json(successMessage("Locale updated successfully"));
};

export const deleteLocale = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.json(errorMessage("Failed to delete locale"));
  }
  res.json(successMessage("Locale deleted successfully"));
};
