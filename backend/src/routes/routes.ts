import express, { Router } from "express";
import { getAllAgents, getReferralAgents, getUser, googleLogin, loginUser, refreshToken, resetUserPassword, updateAgent, userForgotPassword, userRegistration, verifyForgotPassword, verifyUser } from "../controller/auth.controller";
import isAuthenticated from "../utils/middleware/isAuthenticated";

const router: Router = express.Router();

// Authentication
router.post("/google-auth", googleLogin);
router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token", refreshToken);
router.get("/logged-in-user", isAuthenticated, getUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/verify-forgot-password-user", verifyForgotPassword);
router.post("/reset-password-user", resetUserPassword);

// Referred Agents
router.get("/get-all-agents", getAllAgents);
router.put("/add-agent", updateAgent);
router.get("/get-referrals", getReferralAgents);

// Leads add get delete


// Add visits


// delete account / logout


export default router;