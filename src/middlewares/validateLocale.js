import z from "zod";
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
    return res.badRequest("Locale validation failed. Please check the provided data.", result.error);
  }

  const existing = await findByValue(result.data.value);
  if (existing) {
    return res.error(`A locale with value '${result.data.value}' already exists in the system.`, 409, {
      error: `value-${result.data.value}`,
    });
  }

  next();
};

export const validateLocaleUpdate = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Locale ID is required and must be a valid number.");
  }

  const result = localeSchema.safeParse(req.body);
  const localeExists = await findById(id);

  if (!result.success) {
    return res.badRequest("Locale update validation failed. Please check the provided data.", result.error);
  }

  if (!localeExists) {
    return res.notFound(`Locale with ID ${id} was not found in the system.`);
  }

  if (result.data.value) {
    const valueExists = await findByValue(result.data.value);
    if (valueExists && valueExists.id !== id) {
      return res.error(`Locale value '${result.data.value}' is already in use by another locale.`, 409);
    }
  }

  next();
};

export const validateLocaleDelete = async (req, res, next) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.badRequest("Locale ID is required and must be a valid number.");
  }

  const localeExists = await findById(id);
  if (!localeExists) {
    return res.notFound(`Locale with ID ${id} was not found and cannot be deleted.`);
  }

  // Check if locale is associated with a store view
  const storeViewUsingLocale = await prisma.storeView.findFirst({
    where: { localeId: id },
  });

  if (storeViewUsingLocale) {
    return res.badRequest(
      `Cannot delete locale '${localeExists.label}' because it is currently associated with store view '${storeViewUsingLocale.name}'. Please reassign the store view to a different locale first.`
    );
  }

  next();
};
