
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

// Middleware must run before the routes
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// API routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the SkyBridge Store API",
    status: "running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas connected successfully");

    app.listen(PORT, () => {
      console.log(`SkyBridge Store API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the backend:", error.message);
    process.exit(1);
  }
}

startServer();
