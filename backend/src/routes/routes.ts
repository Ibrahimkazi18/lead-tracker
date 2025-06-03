import express, { Router } from "express";
import { deleteReferralAgent, getAllAgents, getAllAgentsForReferral, getReferralAgents, getUser, googleLogin, loginUser, logoutUser, refreshToken, resetUserPassword, updateAgent, userForgotPassword, userRegistration, verifyForgotPassword, verifyUser } from "../controller/auth.controller";
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
router.get("/get-all-agents", isAuthenticated , getAllAgents);
router.get("/get-available-agents", isAuthenticated , getAllAgentsForReferral);
router.put("/add-agent", isAuthenticated , updateAgent);
router.get("/get-referrals/:id", isAuthenticated , getReferralAgents);
router.delete("/delete-referral-agent/:id", isAuthenticated , deleteReferralAgent);

// Leads add get delete


// Add visits


// delete account


// logout
router.post("/logout-user", logoutUser);

export default router;