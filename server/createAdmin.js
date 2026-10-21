
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const name = "Store Administrator";
    const email = "admin@skybridge.local";
    const password = process.env.ADMIN_PASSWORD;

    if (!password || password.length < 8) {
      throw new Error(
        "Set ADMIN_PASSWORD to a password of at least 8 characters in your server/.env file."
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = "admin";
      existingUser.passwordHash = await bcrypt.hash(password, 10);
      await existingUser.save();

      console.log("Existing account updated with admin role.");
    } else {
      const passwordHash = await bcrypt.hash(password, 10);

      await User.create({
        name,
        email,
        passwordHash,
        role: "admin",
      });

      console.log("Admin account created successfully.");
    }

    console.log("Admin email:", email);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
