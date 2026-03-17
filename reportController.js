import { db, newId } from "./store.js";
import { successResponse } from "./response.js";

export const getReports = async (req, res) => {
  return successResponse(res, db.reports);
};

export const generateReport = async (req, res) => {
  const report = { _id: newId("rep"), ...req.body, status: "READY", createdAt: new Date() };
  db.reports.push(report);
  return successResponse(res, report, "Report generated", 201);
};

