import express, { Router } from "express";
import { changeUserPassword, deleteAgentAccount, getUser, googleLogin, loginUser, logoutUser, refreshToken, resetUserPassword, userForgotPassword, userRegistration, verifyForgotPassword, verifyUser } from "../controller/auth.controller";
import isAuthenticated from "../utils/middleware/isAuthenticated";
import { addVisit, createLead, deleteReferralAgent, getAgent, getAgentExpiryDays, getAgentLead, getAgentLeads, getAllAgents, getAllAgentsForReferral, getConvertedLeadsByMonth, getExpiringLeads, getLeadsByWeek, getMonthlyRevenueByAgent, getReferralAgents, getStatusDistribution, getTopAgents, getTotalRevenueByAgent, updateAgent, updateExpiryDays, updateLeadStatus } from "../controller/data.controller";
import { changeAdminPassword, getAdmin, loginAdmin, logoutAdmin, refreshAdminToken, registerAdmin, verifyAdmin } from "../controller/admin.controller";
import isAdminAuthenticated from "../utils/middleware/isAdminAuthenticated";
import { confirmSubscription, createPlan, deletePlan, getActiveAgentPlan, getAdminMonthlyRevenueStats, getAdminRevenueStats, getAllActivePlans, getAllPlans, getPendingRequests, getPlan, getPlanWiseRevenueStats, rejectSubscription, requestSubscription, setDefaultPlan, updatePlan } from "../controller/subscription.controller";

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
router.post("/change-password-user/:agentId", changeUserPassword);

// admin authentication
router.post("/admin-registration", registerAdmin);
router.post("/verify-admin", verifyAdmin);
router.post("/login-admin", loginAdmin);
router.post("/refresh-admin-token", refreshAdminToken);
router.get("/logged-in-admin", isAdminAuthenticated, getAdmin);
router.post("/change-password-admin/:adminId", changeAdminPassword);

// Referred Agents
router.get("/get-agent/:agentId", isAuthenticated , getAgent);
router.get("/get-all-agents", isAuthenticated , getAllAgents);
router.get("/get-expiry-days/:agentId", isAuthenticated , getAgentExpiryDays);
router.get("/get-available-agents", isAuthenticated , getAllAgentsForReferral);
router.put("/add-agent", isAuthenticated , updateAgent);
router.get("/get-referrals/:id", isAuthenticated , getReferralAgents);
router.delete("/delete-referral-agent/:id", isAuthenticated , deleteReferralAgent);

// Leads and visit add get delete
router.post("/create-lead", isAuthenticated, createLead);
router.put("/add-visit", isAuthenticated, addVisit);
router.put("/update-lead-status", isAuthenticated, updateLeadStatus);
router.get("/get-agent-leads/:agentId", isAuthenticated, getAgentLeads);
router.get("/get-agent-leads/:agentId/:leadId", isAuthenticated, getAgentLead);

// fetching stats
router.get("/get-leads-by-week/:agentId", isAuthenticated, getLeadsByWeek);
router.get("/get-converted-leads-by-month/:agentId", isAuthenticated, getConvertedLeadsByMonth);
router.get("/get-monthly-revenue/:agentId", isAuthenticated, getMonthlyRevenueByAgent);
router.get("/get-total-revenue/:agentId", isAuthenticated, getTotalRevenueByAgent);
router.get("/get-expiring-leads/:agentId", isAuthenticated, getExpiringLeads);
router.get("/get-status-distribution/:agentId", isAuthenticated, getStatusDistribution);
router.get("/get-top-agents", isAuthenticated, getTopAgents);

// subcription
router.post("/create-plan", isAdminAuthenticated, createPlan);
router.get("/get-all-plans", isAdminAuthenticated, getAllPlans);
router.get("/get-all-plans-agent", isAuthenticated, getAllPlans);
router.put("/update-plan/:id", isAdminAuthenticated, updatePlan);
router.delete("/delete-plan/:id", isAdminAuthenticated, deletePlan);
router.patch("/set-default/:planId", isAdminAuthenticated, setDefaultPlan);
router.post("/request-subscription/:agentId", isAuthenticated, requestSubscription);
router.get("/get-pending-requests", isAdminAuthenticated, getPendingRequests);
router.put("/confirm-subscription/:id", isAdminAuthenticated, confirmSubscription);
router.put("/reject-subscription/:id", isAdminAuthenticated, rejectSubscription);
router.get("/get-all-active-plans", isAdminAuthenticated, getAllActivePlans);
router.get("/get-active-agent-plan/:agentId", isAuthenticated, getActiveAgentPlan);
router.get("/get-plan/:planId", isAuthenticated, getPlan);
router.get("/get-admin-revenue-stats", isAdminAuthenticated, getAdminRevenueStats);
router.get("/get-admin-monthly-revenue-stats", isAdminAuthenticated, getAdminMonthlyRevenueStats);
router.get("/get-plan-wise-revenue-stats", isAdminAuthenticated, getPlanWiseRevenueStats);

// update expiry days
router.post("/update-expiry-days/:agentId", isAuthenticated, updateExpiryDays);

// delete account
router.delete("/delete-user/:agentId", deleteAgentAccount);

// logout
router.post("/logout-user", logoutUser);
router.post("/logout-admin", logoutAdmin);

export default router;