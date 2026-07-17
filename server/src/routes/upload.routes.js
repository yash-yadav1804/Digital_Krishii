const express = require("express");

const { uploadImage, uploadPdf } = require("../controllers/upload.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const {
  uploadImage: imageUpload,
  uploadPdf: pdfUpload,
} = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/image", protect, imageUpload.single("image"), uploadImage);

router.post(
  "/pdf",
  protect,
  authorizeRoles("ADMIN"),
  pdfUpload.single("pdf"),
  uploadPdf,
);

module.exports = router;
