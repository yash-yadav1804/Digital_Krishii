const { z } = require("zod");

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must contain at least 2 characters"),

  lastName: z.string().min(2, "Last name must contain at least 2 characters"),

  email: z.email("Invalid email address"),

  password: z.string().min(6, "Password must contain at least 6 characters"),

  role: z.enum(["FARMER", "BUYER"]),
});

const loginSchema = z.object({
  email: z.email("Invalid email"),

  password: z.string().min(6),
});

module.exports = {
  registerSchema,
  loginSchema,
};
