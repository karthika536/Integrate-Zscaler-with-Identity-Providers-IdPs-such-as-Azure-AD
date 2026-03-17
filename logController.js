import { db } from "./store.js";
import { successResponse } from "./response.js";

export const getLogs = async (req, res) => {
  // Inline populate: attach user/actor objects to log entries
  const accessLogs = db.accessLogs.map((l) => ({
    ...l, user: db.users.find((u) => u._id === l.userId) || null
  }));
  const auditLogs = db.auditLogs.map((l) => ({
    ...l, actor: db.users.find((u) => u._id === l.actorId) || null
  }));
  return successResponse(res, { accessLogs, authLogs: db.authLogs, auditLogs });
};

