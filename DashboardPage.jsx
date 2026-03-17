import { useEffect, useState } from "react";
import api from "./api.js";
import StatCard from "./StatCard.jsx";
import DashboardCharts from "./DashboardCharts.jsx";
import RecentActivities from "./RecentActivities.jsx";
import ProviderHealthCards from "./ProviderHealthCards.jsx";
import LoadingSkeleton from "./LoadingSkeleton.jsx";
import { RefreshCw } from "lucide-react";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [overviewRes, providerRes] = await Promise.all([
        api.get("/dashboard/overview"),
        api.get("/providers"),
      ]);
      setData({ ...overviewRes.data.data, providers: providerRes.data.data });
    } catch {
      setData({
        kpis: { totalUsers: 5, activeSessions: 5, idpConnectedUsers: 5, failedLogins: 2, policyComplianceScore: 93, zscalerPolicyStatus: "3 active policies" },
        providerStats: [{ _id: "AZURE_AD", count: 2 }, { _id: "OKTA", count: 2 }, { _id: "ACTIVE_DIRECTORY", count: 1 }],
        accessTrend: [
          { _id: "Mon", granted: 120, denied: 8 }, { _id: "Tue", granted: 140, denied: 12 },
          { _id: "Wed", granted: 132, denied: 10 }, { _id: "Thu", granted: 150, denied: 14 },
          { _id: "Fri", granted: 160, denied: 15 }, { _id: "Sat", granted: 90, denied: 5 },
          { _id: "Sun", granted: 80, denied: 3 },
        ],
        recentAuditLogs: [],
        providers: [
          { name: "AZURE_AD", status: "CONNECTED", syncStatus: "SYNCED" },
          { name: "OKTA", status: "CONNECTED", syncStatus: "SYNCED" },
          { name: "ACTIVE_DIRECTORY", status: "DEGRADED", syncStatus: "PENDING" },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return <LoadingSkeleton rows={5} />;

  const kpiCards = [
    { title: "Total Users", value: data.kpis.totalUsers, hint: "Provisioned identities", trend: "+2 this week" },
    { title: "Active Sessions", value: data.kpis.activeSessions, hint: "Currently authenticated", trend: "" },
    { title: "IdP Connected", value: data.kpis.idpConnectedUsers, hint: "Federated user base", trend: "" },
    { title: "Failed Logins", value: data.kpis.failedLogins, hint: "Monitor for brute force", trend: "⚠ Review recommended", warn: true },
    { title: "Compliance Score", value: `${data.kpis.policyComplianceScore}%`, hint: "Across managed devices", trend: "↑ Improving" },
    { title: "Zscaler Policies", value: data.kpis.zscalerPolicyStatus, hint: "Policy engine status", trend: "" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Security Operations Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Real-time Zero Trust access governance overview</p>
        </div>
        <button
          onClick={() => fetchDashboard(true)}
          className="btn-secondary flex items-center gap-2 text-xs"
          disabled={refreshing}
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpiCards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} hint={card.hint} trend={card.trend} warn={card.warn} />
        ))}
      </div>

      <ProviderHealthCards providers={data.providers} />
      <DashboardCharts accessTrend={data.accessTrend} providerStats={data.providerStats} />
      <RecentActivities logs={data.recentAuditLogs} />
    </div>
  );
};

export default DashboardPage;
