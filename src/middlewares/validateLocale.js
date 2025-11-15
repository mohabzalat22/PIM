import z from "zod";
import { errorMessage } from "../utils/message.js";
import { findById, findByValue } from "../models/localeModel.js";

const localeSchema = z.object({
  value: z.string().min(1, "Locale value is required"),
  label: z.string().min(1, "Locale label is required"),
});

export const validateLocaleCreation = async (req, res, next) => {
  const result = localeSchema.safeParse(req.body);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate locale", 500, result.error)
    );
  }

  const existing = await findByValue(result.data.value);
  if (existing) {
    return res.json(
      errorMessage("Locale with the same value already exists", 409, {
        error: `value-${result.data.value}`,
      })
    );
  }

  next();
};

export const validateLocaleUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const result = localeSchema.safeParse(req.body);
  const localeExists = await findById(id);

  if (!result.success) {
    return res.json(
      errorMessage("Failed to validate locale update", 500, result.error)
    );
  }

  if (!localeExists) {
    return res.json(errorMessage("Unable to find locale to update", 404));
  }

  if (result.data.value) {
    const valueExists = await findByValue(result.data.value);
    if (valueExists && valueExists.id !== id) {
      return res.json(
        errorMessage("Locale with the same value already exists", 409)
      );
    }
  }

  next();
};

export const validateLocaleDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("ID not defined"));
  }

  const localeExists = await findById(id);
  if (!localeExists) {
    return res.json(errorMessage("Unable to find locale to delete", 404));
  }

  next();
};
