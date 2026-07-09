const { z } = require("zod");

const createLandSchema = z.object({
  title: z
    .string()
    .min(3, "Title must contain at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  area: z.coerce.number().positive("Area must be greater than 0"),

  areaUnit: z.string().min(1, "Area unit is required").optional(),

  price: z.coerce.number().positive("Price must be greater than 0"),

  priceUnit: z.enum(["PER_ACRE", "PER_MONTH"]),

  listingType: z.enum(["CONTRACT_FARMING", "RENT"]),

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

const updateLandSchema = createLandSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

module.exports = {
  createLandSchema,
  updateLandSchema,
};
