import bcrypt from "bcryptjs";
import { db } from "./store.js";
import { successResponse, errorResponse } from "./response.js";

export const getSettings = async (req, res) => {
  return successResponse(res, db.settings);
};

export const updateSettings = async (req, res) => {
  Object.assign(db.settings, req.body);
  return successResponse(res, db.settings, "Settings updated");
};

export const updateProfile = async (req, res) => {
  const idx = db.users.findIndex((u) => u._id === req.user._id);
  if (idx === -1) return errorResponse(res, "User not found", 404);
  db.users[idx] = { ...db.users[idx], ...req.body };
  return successResponse(res, db.users[idx], "Profile updated");
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = db.users.find((u) => u._id === req.user._id);
    if (!user) return errorResponse(res, "User not found", 404);
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return errorResponse(res, "Current password is incorrect", 400);
    user.password = await bcrypt.hash(newPassword, 8);
    return successResponse(res, null, "Password changed successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

