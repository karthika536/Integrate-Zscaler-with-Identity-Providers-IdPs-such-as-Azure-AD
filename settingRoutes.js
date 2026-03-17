import express from "express";
import {
  getSettings,
  updateSettings,
  updateProfile,
  changePassword
} from "./settingController.js";
import { protect } from "./authMiddleware.js";
import { allowRoles } from "./rbacMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", allowRoles("SUPER_ADMIN", "SECURITY_ADMIN", "IT_ADMIN"), getSettings);
router.put("/", allowRoles("SUPER_ADMIN", "SECURITY_ADMIN", "IT_ADMIN"), updateSettings);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);

export default router;

