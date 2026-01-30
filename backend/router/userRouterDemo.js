import express from "express";
import {
  patientRegisterDemo,
  loginDemo,
  logoutPatientDemo,
  logoutAdminDemo,
  getPatientDetailsDemo,
  getAdminDetailsDemo,
  addNewAdminDemo,
  addNewDoctorDemo,
  getAllDoctorsDemo,
} from "../controller/userControllerDemo.js";

const router = express.Router();

// Patient routes
router.post("/patient/register-demo", patientRegisterDemo);
router.post("/login-demo", loginDemo);
router.get("/patient/logout-demo", logoutPatientDemo);
router.get("/patient/me-demo", getPatientDetailsDemo);

// Admin routes
router.post("/admin/addnew-demo", addNewAdminDemo);
router.get("/admin/logout-demo", logoutAdminDemo);
router.get("/admin/me-demo", getAdminDetailsDemo);

// Doctor routes
router.post("/doctor/addnew-demo", addNewDoctorDemo);
router.get("/doctors-demo", getAllDoctorsDemo);

export default router;
