
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required. Please log in as an admin.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        message: "Authentication is not configured correctly.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "_id name email role"
    );

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges are required.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        message: "Invalid authentication token. Please log in again.",
      });
    }

    console.error("Admin authentication error:", error.message);

    return res.status(500).json({
      message: "Could not verify administrator access.",
    });
  }
};

module.exports = adminAuth;
