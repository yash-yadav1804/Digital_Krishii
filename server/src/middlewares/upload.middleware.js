const multer = require("multer");
const AppError = require("../utils/AppError");

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedImageTypes.includes(file.mimetype)) {
    return cb(
      new AppError("Only JPG, JPEG, PNG and WEBP images are allowed", 400),
      false,
    );
  }

  cb(null, true);
};

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new AppError("Only PDF files are allowed", 400), false);
  }

  cb(null, true);
};

const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadPdf = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadImage,
  uploadPdf,
};
