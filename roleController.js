import { db } from "./store.js";
import { successResponse } from "./response.js";

export const getRoles = async (req, res) => {
  return successResponse(res, db.roles);
};

