import express from "express";
import { getDashboardOverview } from "./dashboardController.js";
import { protect } from "./authMiddleware.js";
import { requirePermission } from "./rbacMiddleware.js";

const router = express.Router();

router.get("/overview", protect, requirePermission("VIEW_DASHBOARD"), getDashboardOverview);

export default router;

