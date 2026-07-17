const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/AppError");

const uploadBufferToCloudinary = (
  fileBuffer,
  folder,
  resourceType = "image",
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

const uploadImageFile = async (file) => {
  if (!file) {
    throw new AppError("Image file is required", 400);
  }

  const result = await uploadBufferToCloudinary(
    file.buffer,
    "digital-krishii/images",
    "image",
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

const uploadPdfFile = async (file) => {
  if (!file) {
    throw new AppError("PDF file is required", 400);
  }

  const result = await uploadBufferToCloudinary(
    file.buffer,
    "digital-krishii/pdfs",
    "raw",
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

module.exports = {
  uploadImageFile,
  uploadPdfFile,
};
