import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Find all subscriptions with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} limit - Number of records to return
 * @param {Object} filters - Filtering options
 * @returns {Promise<[Array, number]>} - Array of subscriptions and total count
 */
export const findAll = async (skip, limit, filters = {}) => {
  const where = {};

  // Status filter
  if (filters.status) {
    where.status = filters.status;
  }

  // Plan filter
  if (filters.plan) {
    where.plan = {
      contains: filters.plan,
    };
  }

  // User ID filter
  if (filters.userId) {
    where.userId = parseInt(filters.userId);
  }

  // Date range filter for startDate
  if (filters.startDateFrom || filters.startDateTo) {
    where.startDate = {};
    if (filters.startDateFrom) {
      where.startDate.gte = new Date(filters.startDateFrom);
    }
    if (filters.startDateTo) {
      where.startDate.lte = new Date(filters.startDateTo);
    }
  }

  // Date range filter for endDate
  if (filters.endDateFrom || filters.endDateTo) {
    where.endDate = {};
    if (filters.endDateFrom) {
      where.endDate.gte = new Date(filters.endDateFrom);
    }
    if (filters.endDateTo) {
      where.endDate.lte = new Date(filters.endDateTo);
    }
  }

  const subscriptions = await prisma.subscription.findMany({
    skip,
    take: limit,
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.subscription.count({ where });

  return [subscriptions, total];
};

/**
 * Find subscription by ID
 * @param {number} id - Subscription ID
 * @returns {Promise<Object|null>} - Subscription object or null
 */
export const findById = async (id) => {
  return await prisma.subscription.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
    },
  });
};

/**
 * Create a new subscription
 * @param {Object} data - Subscription data
 * @returns {Promise<Object>} - Created subscription
 */
export const create = async (data) => {
  const subscriptionData = {
    userId: typeof data.userId === "string" ? Number(data.userId) : data.userId,
    plan: data.plan,
    status: data.status || "INACTIVE",
  };

  // Add optional fields if provided
  if (data.stripeSubscriptionId) {
    subscriptionData.stripeSubscriptionId = data.stripeSubscriptionId;
  }
  if (data.startDate) {
    subscriptionData.startDate = new Date(data.startDate);
  }
  if (data.endDate) {
    subscriptionData.endDate = new Date(data.endDate);
  }

  return await prisma.subscription.create({
    data: subscriptionData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
    },
  });
};

/**
 * Update subscription by ID
 * @param {number} id - Subscription ID
 * @param {Object} data - Updated subscription data
 * @returns {Promise<Object>} - Updated subscription
 */
export const update = async (id, data) => {
  const updateData = {};

  // Update fields if provided
  if (data.plan !== undefined) updateData.plan = data.plan;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.stripeSubscriptionId !== undefined) {
    updateData.stripeSubscriptionId = data.stripeSubscriptionId;
  }
  if (data.startDate !== undefined) {
    updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  }
  if (data.endDate !== undefined) {
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  }

  return await prisma.subscription.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
    },
  });
};

/**
 * Delete subscription by ID
 * @param {number} id - Subscription ID
 * @returns {Promise<Object>} - Deleted subscription
 */
export const remove = async (id) => {
  return await prisma.subscription.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Remove by Stripe Subscription ID
 * @param {string} stripeSubscriptionId - Stripe Subscription ID
 * @returns {Promise<Object>} - Deleted subscription
 */
export const removeByStripeId = async (stripeSubscriptionId) => {
  return await prisma.subscription.delete({
    where: { stripeSubscriptionId: parseInt(stripeSubscriptionId) },
  });
};

/**
 * Find subscriptions by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of user subscriptions
 */
export const findByUserId = async (userId) => {
  return await prisma.subscription.findUnique({
    where: { userId: parseInt(userId) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
    },
  });
};

/**
 * Update subscription status
 * @param {number} id - Subscription ID
 * @param {string} status - New status (ACTIVE, INACTIVE, CANCELED, PAST_DUE)
 * @returns {Promise<Object>} - Updated subscription
 */
export const updateStatus = async (id, status) => {
  return await prisma.subscription.update({
    where: { id: parseInt(id) },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
    },
  });
};

/**
 * Find active subscriptions
 * @param {number} skip - Number of records to skip (optional)
 * @param {number} limit - Number of records to return (optional)
 * @returns {Promise<Array>} - Array of active subscriptions
 */
export const findActiveSubscriptions = async (skip = 0, limit = null) => {
  const queryOptions = {
    where: { status: "ACTIVE" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  };

  if (limit) {
    queryOptions.skip = skip;
    queryOptions.take = limit;
  }

  return await prisma.subscription.findMany(queryOptions);
};

/**
 * Find subscription by Stripe subscription ID
 * @param {string} stripeSubscriptionId - Stripe subscription ID
 * @returns {Promise<Object|null>} - Subscription object or null
 */
export const findByStripeId = async (stripeSubscriptionId) => {
  return await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
    },
  });
};

/**
 * Find expired subscriptions
 * @returns {Promise<Array>} - Array of expired subscriptions
 */
export const findExpiredSubscriptions = async () => {
  const now = new Date();
  return await prisma.subscription.findMany({
    where: {
      endDate: {
        lt: now,
      },
      status: {
        in: ["ACTIVE", "PAST_DUE"],
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          clerkId: true,
        },
      },
    },
    orderBy: {
      endDate: "desc",
    },
  });
};