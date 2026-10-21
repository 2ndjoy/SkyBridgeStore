
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/Product");

async function seedProducts() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    const filePath = path.join(__dirname, "../database/products.json");
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

    await mongoose.connect(process.env.MONGODB_URI);

    // Insert sample products only when the collection is empty.
    const existingCount = await Product.countDocuments();

    if (existingCount > 0) {
      console.log(
        `Seed skipped: ${existingCount} product(s) already exist.`
      );
      return;
    }

    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
