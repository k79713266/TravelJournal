require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/traveljournal";

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  family: 4,
})
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) =>
    console.log("MongoDB Connection Error:", error)
  );

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
  })
);

app.use(express.json());

// Static uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/ai", aiRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Travel Journal Backend is Running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});