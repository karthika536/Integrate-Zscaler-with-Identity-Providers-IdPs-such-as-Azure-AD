import express from "express";
import { getRoles } from "./roleController.js";
import { protect } from "./authMiddleware.js";
import { allowRoles } from "./rbacMiddleware.js";

const router = express.Router();

router.get("/", protect, allowRoles("SUPER_ADMIN", "SECURITY_ADMIN", "IT_ADMIN"), getRoles);

export default router;

