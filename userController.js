import bcrypt from "bcryptjs";
import { db, newId } from "./store.js";
import { successResponse, errorResponse } from "./response.js";

export const getUsers = async (req, res) => {
  try {
    const { search = "", role, department, provider } = req.query;
    const s = search.toLowerCase();
    const users = db.users.filter((u) => {
      const matchSearch = !s || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(s);
      const matchRole   = role       ? u.role?.name       === role       : true;
      const matchDept   = department ? u.department?.name === department : true;
      const matchProv   = provider   ? u.provider         === provider   : true;
      return matchSearch && matchRole && matchDept && matchProv;
    });
    return successResponse(res, users);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getUserById = async (req, res) => {
  const user = db.users.find((u) => u._id === req.params.id);
  if (!user) return errorResponse(res, "User not found", 404);
  return successResponse(res, user);
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roleName, provider = "LOCAL", groups = [] } = req.body;
    const role = db.roles.find((r) => r.name === roleName);
    if (!role) return errorResponse(res, "Invalid role", 400);
    const user = {
      _id: newId("u"), firstName, lastName,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password || "Password@123", 8),
      role, department: null, groups, provider,
      mfaEnabled: false, status: "ACTIVE", lastLoginAt: null, createdAt: new Date()
    };
    db.users.push(user);
    return successResponse(res, user, "User created", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateUser = async (req, res) => {
  const idx = db.users.findIndex((u) => u._id === req.params.id);
  if (idx === -1) return errorResponse(res, "User not found", 404);
  const update = { ...req.body };
  if (update.roleName) { update.role = db.roles.find((r) => r.name === update.roleName); delete update.roleName; }
  db.users[idx] = { ...db.users[idx], ...update };
  return successResponse(res, db.users[idx], "User updated");
};

export const deleteUser = async (req, res) => {
  const idx = db.users.findIndex((u) => u._id === req.params.id);
  if (idx === -1) return errorResponse(res, "User not found", 404);
  db.users.splice(idx, 1);
  return successResponse(res, null, "User deleted");
};

