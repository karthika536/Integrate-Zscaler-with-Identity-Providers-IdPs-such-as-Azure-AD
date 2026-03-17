import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "./userController.js";
import { protect } from "./authMiddleware.js";
import { requirePermission } from "./rbacMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", requirePermission("MANAGE_USERS"), getUsers);
router.get("/:id", requirePermission("MANAGE_USERS"), getUserById);
router.post("/", requirePermission("MANAGE_USERS"), createUser);
router.put("/:id", requirePermission("MANAGE_USERS"), updateUser);
router.delete("/:id", requirePermission("MANAGE_USERS"), deleteUser);

export default router;

