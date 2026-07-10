const { z } = require("zod");

const createEquipmentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must contain at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  equipmentType: z
    .string()
    .min(2, "Equipment type must contain at least 2 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  brand: z.string().optional(),

  modelName: z.string().optional(),

  condition: z.string().optional(),

  rentPrice: z.coerce.number().positive("Rent price must be greater than 0"),

  priceUnit: z.enum(["PER_HOUR", "PER_DAY", "PER_WEEK", "PER_MONTH"]),

  imageUrl: z.string().url("Image URL must be valid").optional(),

  address: z
    .string()
    .min(3, "Address must contain at least 3 characters")
    .optional(),

  district: z
    .string()
    .min(2, "District must contain at least 2 characters")
    .optional(),

  state: z
    .string()
    .min(2, "State must contain at least 2 characters")
    .optional(),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits")
    .optional(),
});

const updateEquipmentSchema = createEquipmentSchema
  .extend({
    status: z.enum(["AVAILABLE", "MAINTENANCE"]).optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

const createEquipmentRentalSchema = z
  .object({
    equipmentId: z.uuid("Invalid equipment id"),

    startDate: z.coerce.date({
      message: "Start date must be valid",
    }),

    endDate: z.coerce.date({
      message: "End date must be valid",
    }),

    message: z
      .string()
      .max(500, "Message cannot exceed 500 characters")
      .optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

const updateRentalStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

module.exports = {
  createEquipmentSchema,
  updateEquipmentSchema,
  createEquipmentRentalSchema,
  updateRentalStatusSchema,
};
