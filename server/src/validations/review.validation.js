const { z } = require("zod");

const createReviewSchema = z
  .object({
    targetType: z.enum(["CONTRACT_REQUEST", "EQUIPMENT_RENTAL"]),

    contractRequestId: z
      .string()
      .uuid("Invalid contract request id")
      .optional(),

    equipmentRentalId: z
      .string()
      .uuid("Invalid equipment rental id")
      .optional(),

    revieweeId: z.string().uuid("Invalid reviewee id"),

    rating: z
      .number()
      .int("Rating must be a whole number")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),

    comment: z
      .string()
      .max(500, "Comment cannot exceed 500 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.targetType === "CONTRACT_REQUEST") {
        return data.contractRequestId && !data.equipmentRentalId;
      }

      if (data.targetType === "EQUIPMENT_RENTAL") {
        return data.equipmentRentalId && !data.contractRequestId;
      }

      return false;
    },
    {
      message:
        "Provide only contractRequestId for contract reviews or only equipmentRentalId for equipment reviews",
      path: ["targetType"],
    },
  );

module.exports = {
  createReviewSchema,
};
