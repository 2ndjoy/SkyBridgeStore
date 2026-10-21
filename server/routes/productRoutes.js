
const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Prepare product data and validate required fields
const validateProductData = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Product data must be sent as a JSON object.";
  }

  const requiredFields = ["name", "description", "price", "category"];

  const missingFields = requiredFields.filter((field) => {
    const value = body[field];

    return (
      value === undefined ||
      value === null ||
      (typeof value === "string" && !value.trim())
    );
  });

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}.`;
  }

  if (
    typeof body.name !== "string" ||
    typeof body.description !== "string" ||
    typeof body.category !== "string"
  ) {
    return "Name, description, and category must be text.";
  }

  if (
    body.name.trim().length > 120 ||
    body.description.trim().length > 1000
  ) {
    return "Product name or description exceeds the allowed length.";
  }

  if (
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price < 0
  ) {
    return "Price must be a valid number greater than or equal to zero.";
  }

  if (
    body.stock !== undefined &&
    (!Number.isInteger(body.stock) || body.stock < 0)
  ) {
    return "Stock must be a whole number greater than or equal to zero.";
  }

  return null;
};

// GET all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch products.",
    });
  }
});

// GET one product by ID (public)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json(product);
  } catch (error) {
    console.error("Fetch product error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch product.",
    });
  }
});

// ADD a product (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const validationError = validateProductData(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const productData = {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      price: req.body.price,
      category: req.body.category.trim(),
      stock: req.body.stock ?? 0,
      badge: req.body.badge?.trim() ?? "",
      imageUrl: req.body.imageUrl?.trim() ?? "",
    };

    const product = await Product.create(productData);

    return res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Product validation failed.",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Could not create product due to a server error.",
    });
  }
});

// UPDATE a product (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const validationError = validateProductData(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const productData = {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      price: req.body.price,
      category: req.body.category.trim(),
      stock: req.body.stock ?? 0,
      badge: req.body.badge?.trim() ?? "",
      imageUrl: req.body.imageUrl?.trim() ?? "",
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Product validation failed.",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Could not update product due to a server error.",
    });
  }
});

// DELETE a product (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error.message);
    return res.status(500).json({
      message: "Failed to delete product.",
    });
  }
});

module.exports = router;
