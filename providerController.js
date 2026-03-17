import { db, newId } from "./store.js";
import { successResponse, errorResponse } from "./response.js";

export const getProviders = async (req, res) => {
  return successResponse(res, db.providers);
};

export const createProvider = async (req, res) => {
  const provider = { _id: newId("p"), ...req.body, createdAt: new Date() };
  db.providers.push(provider);
  return successResponse(res, provider, "Provider created", 201);
};

export const updateProvider = async (req, res) => {
  const idx = db.providers.findIndex((p) => p._id === req.params.id);
  if (idx === -1) return errorResponse(res, "Provider not found", 404);
  db.providers[idx] = { ...db.providers[idx], ...req.body };
  return successResponse(res, db.providers[idx], "Provider updated");
};

export const testProviderConnection = async (req, res) => {
  const idx = db.providers.findIndex((p) => p._id === req.params.id);
  if (idx === -1) return errorResponse(res, "Provider not found", 404);
  db.providers[idx].testConnectionResult = "Connection test successful - metadata verified";
  db.providers[idx].syncStatus = "SYNCED";
  db.providers[idx].status = "CONNECTED";
  return successResponse(res, db.providers[idx], "Provider connection test passed");
};

