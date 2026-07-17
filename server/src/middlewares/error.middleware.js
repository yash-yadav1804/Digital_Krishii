const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  if (error.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = "Database request failed";
  }

  if (error.name === "PrismaClientValidationError") {
    statusCode = 400;
    message = "Invalid database query";
  }

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    status: `${statusCode}`.startsWith("4") ? "fail" : "error",
    message:
      process.env.NODE_ENV === "production" && statusCode === 500
        ? "Something went wrong. Please try again later."
        : message,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
