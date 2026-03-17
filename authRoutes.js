import express from "express";
import {
  register,
  login,
  simulatedSsoLogin,
  forgotPassword,
  resetPassword,
  me
} from "./authController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/sso-login", simulatedSsoLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, me);

export default router;

