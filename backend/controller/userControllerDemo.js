import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

// In-memory user storage for demo purposes
const demoUsers = new Map();
let userIdCounter = 1;

// Helper function to generate JWT token
const generateToken = (user, res, cookieName) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const cookieExpire = process.env.COOKIE_EXPIRE || 7;

  res.cookie(cookieName, token, {
    expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return token;
};

// Patient Registration (Demo)
export const patientRegisterDemo = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Check if user already exists
  const existingUser = Array.from(demoUsers.values()).find(
    (user) => user.email === email
  );

  if (existingUser) {
    return next(new ErrorHandler("User already registered!", 400));
  }

  // Create new user
  const newUser = {
    _id: `demo_user_${userIdCounter++}`,
    firstName,
    lastName,
    email,
    phone,
    password, // In production, this should be hashed
    gender,
    dob,
    nic,
    role: "Patient",
    createdAt: new Date(),
  };

  demoUsers.set(newUser._id, newUser);

  generateToken(newUser, res, "patientToken");

  res.status(200).json({
    success: true,
    message: "User Registered Successfully! (Demo Mode)",
    user: {
      ...newUser,
      password: undefined, // Don't send password in response
    },
  });
});

// Patient Login (Demo)
export const loginDemo = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;

  console.log('Login attempt:', { email, role, hasPassword: !!password, hasConfirmPassword: !!confirmPassword });

  // Validation
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password Do Not Match!", 400));
  }

  // Find user by email
  const user = Array.from(demoUsers.values()).find(
    (user) => user.email === email && user.role === role
  );

  console.log('User found:', user ? `Yes (${user.firstName} ${user.lastName})` : 'No');
  console.log('All demo users:', Array.from(demoUsers.values()).map(u => ({ email: u.email, role: u.role })));

  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  // Check password (in production, use bcrypt.compare)
  console.log('Password match:', password === user.password);
  
  if (password !== user.password) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const cookieName = role === "Admin" ? "adminToken" : "patientToken";
  generateToken(user, res, cookieName);

  res.status(200).json({
    success: true,
    message: "Login Successfully! (Demo Mode)",
    user: {
      ...user,
      password: undefined,
    },
  });
});

// Patient Logout
export const logoutPatientDemo = catchAsyncErrors(async (req, res, next) => {
  res.cookie("patientToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    success: true,
    message: "Patient Logged Out Successfully!",
  });
});

// Admin Logout
export const logoutAdminDemo = catchAsyncErrors(async (req, res, next) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    success: true,
    message: "Admin Logged Out Successfully!",
  });
});

// Get Patient Info (from token)
export const getPatientDetailsDemo = catchAsyncErrors(async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token!", 401));
  }
});

// Get Admin Info (from token)
export const getAdminDetailsDemo = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return next(new ErrorHandler("Admin is not authenticated!", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = demoUsers.get(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token!", 401));
  }
});

// Add New Admin (Demo)
export const addNewAdminDemo = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

  if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const existingUser = Array.from(demoUsers.values()).find(
    (user) => user.email === email
  );

  if (existingUser) {
    return next(new ErrorHandler("Admin with this email already exists!", 400));
  }

  const newAdmin = {
    _id: `demo_admin_${userIdCounter++}`,
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role: "Admin",
    createdAt: new Date(),
  };

  demoUsers.set(newAdmin._id, newAdmin);

  res.status(200).json({
    success: true,
    message: "New Admin Registered! (Demo Mode)",
    admin: {
      ...newAdmin,
      password: undefined,
    },
  });
});

// Get All Doctors (Demo)
export const getAllDoctorsDemo = catchAsyncErrors(async (req, res, next) => {
  const doctors = Array.from(demoUsers.values()).filter(
    (user) => user.role === "Doctor"
  );

  res.status(200).json({
    success: true,
    doctors: doctors.map(doc => ({ ...doc, password: undefined })),
  });
});

// Add New Doctor (Demo)
export const addNewDoctorDemo = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    doctorDepartment,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !nic ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const existingUser = Array.from(demoUsers.values()).find(
    (user) => user.email === email
  );

  if (existingUser) {
    return next(new ErrorHandler("Doctor with this email already exists!", 400));
  }

  const newDoctor = {
    _id: `demo_doctor_${userIdCounter++}`,
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    doctorDepartment,
    role: "Doctor",
    createdAt: new Date(),
  };

  demoUsers.set(newDoctor._id, newDoctor);

  res.status(200).json({
    success: true,
    message: "New Doctor Registered! (Demo Mode)",
    doctor: {
      ...newDoctor,
      password: undefined,
    },
  });
});

// Initialize with some demo users for testing
const initializeDemoUsers = () => {
  // Demo Patient
  const demoPatient = {
    _id: "demo_patient_1",
    firstName: "Demo",
    lastName: "Patient",
    email: "patient@demo.com",
    phone: "9876543210",
    password: "password123",
    gender: "Male",
    dob: "1995-01-15",
    nic: "1234567890",
    role: "Patient",
    age: 31,
    createdAt: new Date(),
  };
  demoUsers.set(demoPatient._id, demoPatient);

  // Demo Doctor
  const demoDoctor = {
    _id: "demo_doctor_1",
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "doctor@demo.com",
    phone: "9876543211",
    password: "password123",
    gender: "Female",
    dob: "1985-05-20",
    nic: "0987654321",
    doctorDepartment: "Cardiology",
    role: "Doctor",
    createdAt: new Date(),
  };
  demoUsers.set(demoDoctor._id, demoDoctor);

  // Demo Admin
  const demoAdmin = {
    _id: "demo_admin_1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@demo.com",
    phone: "9876543212",
    password: "admin123",
    gender: "Male",
    dob: "1980-03-10",
    nic: "1122334455",
    role: "Admin",
    createdAt: new Date(),
  };
  demoUsers.set(demoAdmin._id, demoAdmin);

  userIdCounter = 4;
  console.log("Demo users initialized successfully!");
  console.log("Patient: patient@demo.com / password123");
  console.log("Doctor: doctor@demo.com / password123");
  console.log("Admin: admin@demo.com / admin123");
};

// Initialize demo users when module loads
initializeDemoUsers();

export { demoUsers };
