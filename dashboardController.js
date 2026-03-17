import { db } from "./store.js";
import { successResponse, errorResponse } from "./response.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const totalUsers       = db.users.length;
    const activeSessions   = db.users.filter((u) => u.status === "ACTIVE").length;
    const idpConnectedUsers = db.users.filter((u) => u.provider !== "LOCAL").length;
    const failedLogins     = db.authLogs.filter((l) => l.status === "FAILED").length;
    const policyCount      = db.policies.filter((p) => p.enabled).length;

    // Aggregate provider login counts
    const providerMap = {};
    db.authLogs.forEach((l) => { providerMap[l.provider] = (providerMap[l.provider] || 0) + 1; });
    const providerStats = Object.entries(providerMap).map(([_id, count]) => ({ _id, count }));

    // Last 7 days trend (static demo data)
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const accessTrend = days.map((d) => ({ _id: d, granted: Math.floor(Math.random()*60)+80, denied: Math.floor(Math.random()*10)+2 }));

    const recentAuditLogs = [...db.auditLogs].reverse().slice(0, 8).map((l) => {
      const actor = db.users.find((u) => u._id === l.actorId);
      return { ...l, actor: actor ? { firstName: actor.firstName, lastName: actor.lastName } : null };
    });

    return successResponse(res, {
      kpis: { totalUsers, activeSessions, idpConnectedUsers, failedLogins, policyComplianceScore: 93, zscalerPolicyStatus: `${policyCount} active policies` },
      providerStats, accessTrend, recentAuditLogs
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

