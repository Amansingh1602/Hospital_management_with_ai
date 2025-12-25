import mongoose from "mongoose";
import { User } from "./models/userSchema.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./config.env" });

// Admin credentials
const adminData = {
  firstName: "Admin",
  lastName: "User",
  email: "admin@hospital.com",
  phone: "0300000000",
  dob: "1990-01-01",
  gender: "Male",
  password: "admin123",
  role: "Admin"
};

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "hospital_management",
    });
    console.log("Connected to database!");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("❌ Admin already exists with this email!");
      console.log("\nAdmin Credentials:");
      console.log("==================");
      console.log("Email:", adminData.email);
      console.log("Password: admin123");
      console.log("Role: Admin");
      process.exit(0);
    }

    // Create admin
    const admin = await User.create(adminData);
    
    console.log("✅ Admin created successfully!");
    console.log("\nAdmin Credentials:");
    console.log("==================");
    console.log("Email:", adminData.email);
    console.log("Password: admin123");
    console.log("Role: Admin");
    console.log("\nYou can now login to the dashboard at:");
    console.log("http://localhost:5174");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
