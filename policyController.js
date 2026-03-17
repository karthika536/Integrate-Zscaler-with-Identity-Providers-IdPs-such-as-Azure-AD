import { db, newId } from "./store.js";
import { successResponse, errorResponse } from "./response.js";

export const getPolicies = async (req, res) => {
  return successResponse(res, db.policies);
};

export const createPolicy = async (req, res) => {
  const policy = { _id: newId("pol"), ...req.body, createdAt: new Date() };
  db.policies.push(policy);
  return successResponse(res, policy, "Policy created", 201);
};

export const updatePolicy = async (req, res) => {
  const idx = db.policies.findIndex((p) => p._id === req.params.id);
  if (idx === -1) return errorResponse(res, "Policy not found", 404);
  db.policies[idx] = { ...db.policies[idx], ...req.body };
  return successResponse(res, db.policies[idx], "Policy updated");
};

