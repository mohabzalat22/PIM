import z from "zod";
import { errorMessage } from "../utils/message.js";
import { findById, findByValue } from "../models/localeModel.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const localeSchema = z.object({
  value: z.string().min(1, "Locale value is required"),
  label: z.string().min(1, "Locale label is required"),
});

export const validateLocaleCreation = async (req, res, next) => {
  const result = localeSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(
      errorMessage("Failed to validate locale", 400, result.error)
    );
  }

  const existing = await findByValue(result.data.value);
  if (existing) {
    return res.status(409).json(
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
    return res.status(400).json(errorMessage("ID not defined", 400));
  }

  const result = localeSchema.safeParse(req.body);
  const localeExists = await findById(id);

  if (!result.success) {
    return res.status(400).json(
      errorMessage("Failed to validate locale update", 400, result.error)
    );
  }

  if (!localeExists) {
    return res.status(404).json(errorMessage("Unable to find locale to update", 404));
  }

  if (result.data.value) {
    const valueExists = await findByValue(result.data.value);
    if (valueExists && valueExists.id !== id) {
      return res.status(409).json(
        errorMessage("Locale with the same value already exists", 409)
      );
    }
  }

  next();
};

export const validateLocaleDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json(errorMessage("ID not defined"));
  }

  const localeExists = await findById(id);
  if (!localeExists) {
    return res.status(404).json(errorMessage("Unable to find locale to delete", 404));
  }

  // Check if locale is associated with a store view
  const storeViewUsingLocale = await prisma.storeView.findFirst({
    where: { localeId: id },
  });

  if (storeViewUsingLocale) {
    return res.status(400).json(
      errorMessage(
        "Cannot delete locale that is associated with a store view",
        400
      )
    );
  }

  next();
};
