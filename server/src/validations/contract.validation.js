const { z } = require("zod");

const createContractRequestSchema = z
  .object({
    templateId: z.string().uuid("Invalid contract template id"),

    landId: z.string().uuid("Invalid land id"),

    cropName: z
      .string()
      .min(2, "Crop name must contain at least 2 characters")
      .optional(),

    quantity: z.string().min(1, "Quantity is required").optional(),

    proposedPrice: z.coerce
      .number()
      .positive("Proposed price must be greater than 0")
      .optional(),

    startDate: z.coerce
      .date({
        message: "Start date must be valid",
      })
      .optional(),

    endDate: z.coerce
      .date({
        message: "End date must be valid",
      })
      .optional(),

    message: z
      .string()
      .max(500, "Message cannot exceed 500 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }

      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

const updateContractRequestStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"]),
});

const cancelContractRequestSchema = z.object({
  reason: z.string().max(300, "Reason cannot exceed 300 characters").optional(),
});

module.exports = {
  createContractRequestSchema,
  updateContractRequestStatusSchema,
  cancelContractRequestSchema,
};
