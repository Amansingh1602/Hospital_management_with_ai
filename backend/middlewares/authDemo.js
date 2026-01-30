import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { demoUsers } from "../controller/userControllerDemo.js";

// Middleware to authenticate patients using demo system
export const isPatientAuthenticatedDemo = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
      return next(new ErrorHandler("User is not authenticated!", 400));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = demoUsers.get(decoded.id);
      
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
      return next(new ErrorHandler("Authentication failed!", 401));
    }
  }
);

// Middleware to authenticate admin using demo system
export const isAdminAuthenticatedDemo = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
      return next(
        new ErrorHandler("Dashboard User is not authenticated!", 400)
      );
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = demoUsers.get(decoded.id);
      
      if (!user) {
        return next(new ErrorHandler("User not found!", 404));
      }
      
      if (user.role !== "Admin") {
        return next(
          new ErrorHandler(`${user.role} not authorized for this resource!`, 403)
        );
      }
      
      req.user = user;
      next();
    } catch (error) {
      return next(new ErrorHandler("Authentication failed!", 401));
    }
  }
);

export const isAuthorizedDemo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource!`,
          403
        )
      );
    }
    next();
  };
};
