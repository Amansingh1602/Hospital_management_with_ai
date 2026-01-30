import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate dashboard users
export const isAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
      return next(
        new ErrorHandler("Dashboard User is not authenticated!", 400)
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Admin") {
      return next(
        new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
      );
    }
    next();
  }
);

// Middleware to authenticate frontend users
export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
      return next(new ErrorHandler("User is not authenticated!", 400));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new ErrorHandler("User not found!", 404));
      }
      
      if (user.role !== "Patient") {
        return next(
          new ErrorHandler(`${user.role} not authorized for this resource!`, 403)
        );
      }
      
      req.user = user;
      next();
    } catch (error) {
      // If database is not connected, create a mock user for demo purposes
      if (error.message.includes('buffering timed out')) {
        console.log("Database not connected, using demo user...");
        req.user = {
          _id: "demo_patient_id",
          firstName: "Demo",
          lastName: "Patient",
          email: "demo@medicareplus.in",
          role: "Patient",
          age: 30,
          gender: "Male"
        };
        return next();
      }
      
      return next(new ErrorHandler("Authentication failed!", 401));
    }
  }
);

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource!`
        )
      );
    }
    next();
  };
};
