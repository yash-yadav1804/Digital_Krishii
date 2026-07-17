const asyncHandler = require("../utils/asyncHandler");

const {
  uploadImageFile,
  uploadPdfFile,
} = require("../services/upload.service");

const uploadImage = asyncHandler(async (req, res) => {
  const result = await uploadImageFile(req.file);

  res.status(201).json({
    success: true,
    message: "Image uploaded successfully",
    data: result,
  });
});

const uploadPdf = asyncHandler(async (req, res) => {
  const result = await uploadPdfFile(req.file);

  res.status(201).json({
    success: true,
    message: "PDF uploaded successfully",
    data: result,
  });
});

module.exports = {
  uploadImage,
  uploadPdf,
};
