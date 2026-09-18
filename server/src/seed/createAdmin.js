import mongoose from "mongoose";
import { User } from "../models/User.model.js";
import { env } from "../config/env.js";

const ADMIN_EMAIL = "admin@test.com";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_NAME = "Super Admin";

const createAdmin = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 2. Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`);
      console.log(`   Role: ${existingAdmin.role}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // 3. Create admin user
    //    Note: password hashed by pre-save hook
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("🎉 Admin created successfully!");
    console.log("=================================");
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Name:     ${ADMIN_NAME}`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   ID:       ${admin._id}`);
    console.log("=================================");
    console.log("⚠️  Change this password immediately in production!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();