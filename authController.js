import bcrypt from "bcryptjs";
import { db, newId } from "./store.js";
import { generateToken } from "./jwt.js";
import { successResponse, errorResponse } from "./response.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roleName = "EMPLOYEE" } = req.body;
    if (db.users.find((u) => u.email === email.toLowerCase())) {
      return errorResponse(res, "User already exists", 409);
    }
    const role = db.roles.find((r) => r.name === roleName);
    if (!role) return errorResponse(res, "Invalid role", 400);

    const user = {
      _id: newId("u"), firstName, lastName,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 8),
      role, department: null, groups: [],
      provider: "LOCAL", mfaEnabled: false,
      status: "ACTIVE", lastLoginAt: null, createdAt: new Date()
    };
    db.users.push(user);
    return successResponse(res, user, "User registered successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.find((u) => u.email === email.toLowerCase());
    if (!user) {
      db.authLogs.push({ _id: newId("auth"), email, provider: "LOCAL", status: "FAILED", reason: "User not found", createdAt: new Date() });
      return errorResponse(res, "Invalid credentials", 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      db.authLogs.push({ _id: newId("auth"), email, provider: "LOCAL", status: "FAILED", reason: "Invalid password", createdAt: new Date() });
      return errorResponse(res, "Invalid credentials", 401);
    }
    user.lastLoginAt = new Date();
    db.authLogs.push({ _id: newId("auth"), email, provider: "LOCAL", status: "SUCCESS", reason: "Local auth", createdAt: new Date() });
    const token = generateToken({ id: user._id, role: user.role.name });
    return successResponse(res, { token, user: { id: user._id, name: `${user.firstName} ${user.lastName}`, email: user.email, role: user.role.name, provider: user.provider } }, "Login successful");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const simulatedSsoLogin = async (req, res) => {
  try {
    const { email, provider } = req.body;
    const validProviders = ["AZURE_AD", "OKTA", "ACTIVE_DIRECTORY"];
    if (!validProviders.includes(provider)) return errorResponse(res, "Unsupported provider", 400);

    const user = db.users.find((u) => u.email === email.toLowerCase() && u.provider === provider);
    if (!user) {
      db.authLogs.push({ _id: newId("auth"), email, provider, status: "FAILED", reason: "User not linked with selected IdP", createdAt: new Date() });
      return errorResponse(res, "SSO failed: user mapping not found for this provider", 404);
    }
    user.lastLoginAt = new Date();
    db.authLogs.push({ _id: newId("auth"), email, provider, status: "SUCCESS", reason: "Simulated SSO successful", createdAt: new Date() });
    const token = generateToken({ id: user._id, role: user.role.name });
    return successResponse(res, { token, user: { id: user._id, name: `${user.firstName} ${user.lastName}`, email: user.email, role: user.role.name, provider: user.provider } }, `${provider} SSO login successful`);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const forgotPassword = async (req, res) => {
  return successResponse(res, null, "Password reset link simulated and sent");
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = db.users.find((u) => u.email === email.toLowerCase());
    if (!user) return errorResponse(res, "User not found", 404);
    user.password = await bcrypt.hash(newPassword, 8);
    return successResponse(res, null, "Password reset successful");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const me = async (req, res) => {
  const u = req.user;
  return successResponse(res, { id: u._id, name: `${u.firstName} ${u.lastName}`, email: u.email, role: u.role.name, provider: u.provider, mfaEnabled: u.mfaEnabled }, "Current user");
};

