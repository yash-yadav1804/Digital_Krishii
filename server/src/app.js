const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const landRoutes = require("./routes/land.routes");
const equipmentRoutes = require("./routes/equipment.routes");
const contractRoutes = require("./routes/contract.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Digital Krishii API is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
module.exports = app;
