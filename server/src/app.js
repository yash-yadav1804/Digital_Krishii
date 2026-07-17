const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const landRoutes = require("./routes/land.routes");
const equipmentRoutes = require("./routes/equipment.routes");
const contractRoutes = require("./routes/contract.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const uploadRoutes = require("./routes/upload.routes");

const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

/*
  Security middlewares
*/
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: "fail",
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

/*
  Test route
*/
app.get("/", (req, res) => {
  res.send("Digital Krishii API is running");
});

/*
  API routes
*/
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);

/*
  Error middlewares
*/
app.use(notFound);
app.use(errorHandler);

module.exports = app;
