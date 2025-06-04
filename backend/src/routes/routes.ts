import express, { Router } from "express";
import { getUser, googleLogin, loginUser, logoutUser, refreshToken, resetUserPassword, userForgotPassword, userRegistration, verifyForgotPassword, verifyUser } from "../controller/auth.controller";
import isAuthenticated from "../utils/middleware/isAuthenticated";
import { addVisit, createLead, deleteReferralAgent, getAllAgents, getAllAgentsForReferral, getConvertedLeadsByMonth, getExpiringLeads, getLeadsByWeek, getReferralAgents, getStatusDistribution, getTopAgents, updateAgent, updateLeadStatus } from "../controller/data.controller";

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

// Leads and visit add get delete
router.post("/create-lead", createLead);
router.put("/add-visit", addVisit);
router.put("/update-lead-status", updateLeadStatus);

// fetching stats
router.get("/get-leads-by-week/:agentId", getLeadsByWeek);
router.get("/get-converted-leads-by-month/:agentId", getConvertedLeadsByMonth);
router.get("/get-expiring-leads/:agentId", getExpiringLeads);
router.get("/get-status-distribution/:agentId", getStatusDistribution);
router.get("/get-top-agents", getTopAgents);

// delete account


// logout
router.post("/logout-user", logoutUser);

export default router;