import {
  findAll,
  findById,
  create,
  update,
  deleteById,
} from "../models/attributeSetModel.js";
import { addAttributeToSet, removeAttributeFromSet } from "../models/attributeSetAttributeModel.js";
import { addAttributeToGroup, removeAttributeFromGroup } from "../models/attributeSetGroupAttributeModel.js";
import { errorMessage, successMessage } from "../utils/message.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAttributeSets = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {
    search: req.query.search || null,
    productType: req.query.productType || null,
    isDefault: req.query.isDefault || null,
    sortBy: req.query.sortBy || "createdAt",
    sortOrder: req.query.sortOrder || "desc",
  };

  const [sets, total] = (await findAll(skip, limit, filters)) ?? [];

  const meta = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return res.json(
    successMessage(sets, 200, "Success fetching attribute sets", meta)
  );
};

export const getAttributeSet = async (req, res) => {
  const id = Number(req.params.id);
  const set = await findById(id);
  return res.json(successMessage(set));
};

export const createAttributeSet = async (req, res) => {
  try {
    const result = await create(req.body);
    return res.json(successMessage(result, 200, "created attribute set"));
  } catch (e) {
    return res.json(
      errorMessage("couldnot create new attribute set", 300, {
        message: e.message,
        code: 800,
      })
    );
  }
};

export const updateAttributeSet = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.json(errorMessage("undefined id"));
  }
  const result = await update(id, req.body);

  if (!result) {
    return res.json(errorMessage("couldnot update attribute set"));
  }
  return res.json(successMessage("updated attribute set"));
};

export const deleteAttributeSet = async (req, res) => {
  const id = Number(req.params.id);
  const result = await deleteById(id);
  if (!result) {
    return res.json(errorMessage("couldnot delete attribute set"));
  }
  return res.json(successMessage("deleted attribute set"));
};

export const addAttributeToAttributeSet = async (req, res) => {
  const attributeSetId = Number(req.params.id);
  const { attributeId, sortOrder } = req.body;

  if (!attributeSetId || !attributeId) {
    return res.json(errorMessage("attributeSetId and attributeId are required"));
  }

  // Do not allow assigning an attribute directly to a set
  // if it is already assigned to any group in the same set
  const existingInGroups = await prisma.attributeSetGroupAttribute.findFirst({
    where: {
      attributeSetId,
      attributeId,
    },
  });

  if (existingInGroups) {
    return res.json(
      errorMessage(
        "Attribute is already assigned to a group in this attribute set",
        400
      )
    );
  }

  const result = await addAttributeToSet({
    attributeSetId,
    attributeId,
    sortOrder,
  });

  return res.json(successMessage(result, 200, "added attribute to set"));
};

export const removeAttributeFromAttributeSet = async (req, res) => {
  const id = Number(req.params.relationId);
  if (!id) {
    return res.json(errorMessage("relation id not defined"));
  }

  const result = await removeAttributeFromSet(id);
  if (!result) {
    return res.json(errorMessage("couldnot remove attribute from set"));
  }

  return res.json(successMessage("removed attribute from set"));
};

export const addAttributeToAttributeGroupInSet = async (req, res) => {
  const attributeSetId = Number(req.params.id);
  const attributeGroupId = Number(req.params.groupId);
  const { attributeId, sortOrder } = req.body;

  if (!attributeSetId || !attributeGroupId || !attributeId) {
    return res.json(
      errorMessage("attributeSetId, attributeGroupId and attributeId are required")
    );
  }

  // Do not allow assigning an attribute to a group if it is
  // already assigned directly to the set
  const existingInSet = await prisma.attributeSetAttribute.findFirst({
    where: {
      attributeSetId,
      attributeId,
    },
  });

  if (existingInSet) {
    return res.json(
      errorMessage(
        "Attribute is already assigned directly to this attribute set",
        400
      )
    );
  }

  // Additionally, prevent assigning the same attribute to more than
  // one group within the same set (in case DB constraint changes)
  const existingInOtherGroup = await prisma.attributeSetGroupAttribute.findFirst({
    where: {
      attributeSetId,
      attributeId,
    },
  });

  if (existingInOtherGroup) {
    return res.json(
      errorMessage(
        "Attribute is already assigned to another group in this attribute set",
        400
      )
    );
  }

  const result = await addAttributeToGroup({
    attributeSetId,
    attributeGroupId,
    attributeId,
    sortOrder,
  });

  return res.json(
    successMessage(result, 200, "added attribute to attribute group in set")
  );
};

export const removeAttributeFromAttributeGroupInSet = async (req, res) => {
  const id = Number(req.params.relationId);
  if (!id) {
    return res.json(errorMessage("relation id not defined"));
  }

  const result = await removeAttributeFromGroup(id);
  if (!result) {
    return res.json(
      errorMessage("couldnot remove attribute from attribute group in set")
    );
  }

  return res.json(successMessage("removed attribute from attribute group in set"));
};
