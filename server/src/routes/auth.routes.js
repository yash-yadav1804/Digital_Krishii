const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.get("/farmer-only", protect, authorizeRoles("FARMER"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Farmer",
  });
});

module.exports = router;
