import mongoose from "mongoose";
import { User } from "./models/userSchema.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./config.env" });

// General Doctor credentials
const generalDoctorData = {
  firstName: "General",
  lastName: "Doctor",
  email: "general.doctor@hospital.com",
  phone: "0300000000",
  dob: "1985-01-01",
  gender: "Male",
  password: "doctor123",
  role: "Doctor",
  doctorDepartment: "General"
};

const createGeneralDoctor = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM_DEPLOYED",
    });
    console.log("Connected to database!");

    // Check if general doctor already exists
    const existingDoctor = await User.findOne({ 
      firstName: "General", 
      lastName: "Doctor",
      role: "Doctor"
    });
    
    if (existingDoctor) {
      console.log("✅ General Doctor already exists!");
      process.exit(0);
    }

    // Create general doctor
    const doctor = await User.create(generalDoctorData);
    
    console.log("✅ General Doctor created successfully!");
    console.log("\nGeneral Doctor Details:");
    console.log("======================");
    console.log("Name: General Doctor");
    console.log("Email:", generalDoctorData.email);
    console.log("Department: General");
    console.log("\nPatients can now book appointments!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating general doctor:", error.message);
    process.exit(1);
  }
};

createGeneralDoctor();
