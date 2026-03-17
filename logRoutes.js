import express from "express";
import { getLogs } from "./logController.js";
import { protect } from "./authMiddleware.js";
import { requirePermission } from "./rbacMiddleware.js";

const router = express.Router();

router.get("/", protect, requirePermission("VIEW_LOGS"), getLogs);

export default router;

