const { z } = require("zod");

const updateProfileSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional(),
  address: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits")
    .optional(),
  profileImage: z.string().url("Profile image must be a valid URL").optional(),
});

module.exports = {
  updateProfileSchema,
};
