import express from "express";
import { getPolicies, createPolicy, updatePolicy } from "./policyController.js";
import { protect } from "./authMiddleware.js";
import { requirePermission } from "./rbacMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", requirePermission("MANAGE_POLICIES"), getPolicies);
router.post("/", requirePermission("MANAGE_POLICIES"), createPolicy);
router.put("/:id", requirePermission("MANAGE_POLICIES"), updatePolicy);

export default router;

