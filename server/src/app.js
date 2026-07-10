const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const landRoutes = require("./routes/land.routes");
const equipmentRoutes = require("./routes/equipment.routes");

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
module.exports = app;
