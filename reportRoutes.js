import express from "express";
import { getReports, generateReport } from "./reportController.js";
import { protect } from "./authMiddleware.js";
import { requirePermission } from "./rbacMiddleware.js";

const router = express.Router();

router.get("/", protect, requirePermission("VIEW_REPORTS"), getReports);
router.post("/", protect, requirePermission("VIEW_REPORTS"), generateReport);
router.post("/generate", protect, requirePermission("VIEW_REPORTS"), generateReport);

export default router;

