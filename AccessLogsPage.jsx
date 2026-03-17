import { useEffect, useState } from "react";
import api from "./api.js";
import DataTable from "./DataTable.jsx";
import { toast } from "react-toastify";
import { Download, Filter } from "lucide-react";

const TABS = ["Access Logs", "Auth Logs", "Audit Logs"];

const resultBadge = (r) => (
  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold border ${r === "GRANTED" || r === "SUCCESS" ? "text-green-400 bg-green-500/10 border-green-500/30" : "text-red-400 bg-red-500/10 border-red-500/30"}`}>{r}</span>
);
const severityBadge = (s) => {
  const m = s === "HIGH" ? "text-red-400 bg-red-500/10 border-red-500/30" : s === "MEDIUM" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" : "text-green-400 bg-green-500/10 border-green-500/30";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold border ${m}`}>{s}</span>;
};

const AccessLogsPage = () => {
  const [logs, setLogs] = useState({ accessLogs: [], authLogs: [], auditLogs: [] });
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState("");
  const [filterFailed, setFilterFailed] = useState(false);

  useEffect(() => {
    api.get("/logs").then((r) => setLogs(r.data.data)).catch(() => {});
  }, []);

  const handleExport = () => {
    const tabData = [logs.accessLogs, logs.authLogs, logs.auditLogs][activeTab];
    const csv = [Object.keys(tabData[0] || {}).join(","), ...tabData.map((r) => Object.values(r).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `logs_tab${activeTab}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const accessCols = [
    { key: "applicationName", label: "Application" },
    { key: "result", label: "Decision", render: (r) => resultBadge(r.result) },
    { key: "policyApplied", label: "Policy Applied" },
    { key: "devicePosture", label: "Device Posture", render: (r) => <span className={r.devicePosture === "COMPLIANT" ? "text-green-400" : "text-red-400"}>{r.devicePosture}</span> },
    { key: "sourceIp", label: "Source IP", render: (r) => <span className="font-mono text-xs">{r.sourceIp}</span> },
    { key: "createdAt", label: "Time", render: (r) => new Date(r.createdAt).toLocaleString() },
  ];

  const authCols = [
    { key: "email", label: "Email" },
    { key: "provider", label: "Provider" },
    { key: "status", label: "Status", render: (r) => resultBadge(r.status) },
    { key: "reason", label: "Reason" },
    { key: "createdAt", label: "Time", render: (r) => new Date(r.createdAt).toLocaleString() },
  ];

  const auditCols = [
    { key: "action", label: "Action" },
    { key: "entityType", label: "Entity Type" },
    { key: "severity", label: "Severity", render: (r) => severityBadge(r.severity) },
    { key: "details", label: "Details", render: (r) => <span className="text-xs text-slate-400 max-w-[200px] truncate block">{r.details}</span> },
    { key: "createdAt", label: "Time", render: (r) => new Date(r.createdAt).toLocaleString() },
  ];

  const tabData = [logs.accessLogs, logs.authLogs, logs.auditLogs];
  const tabCols = [accessCols, authCols, auditCols];

  const filteredData = tabData[activeTab].filter((row) => {
    const text = JSON.stringify(row).toLowerCase();
    const matchSearch = !query || text.includes(query.toLowerCase());
    const matchFailed = !filterFailed || text.includes("failed") || text.includes("denied");
    return matchSearch && matchFailed;
  });

  const summaryStats = [
    { label: "Total Access Events", value: logs.accessLogs.length },
    { label: "Access Denied", value: logs.accessLogs.filter((l) => l.result === "DENIED").length, warn: true },
    { label: "Auth Failures", value: logs.authLogs.filter((l) => l.status === "FAILED").length, warn: true },
    { label: "Audit Events", value: logs.auditLogs.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Logs & Monitoring</h1>
        <p className="text-sm text-slate-400 mt-1">Authentication, access decision, and admin audit trail records</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {summaryStats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
            <p className={`font-display text-2xl font-bold mt-1 ${s.warn && s.value > 0 ? "text-red-400" : "text-white"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-slate-700 bg-slate-900/50 p-1 w-fit">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(i); setQuery(""); setFilterFailed(false); }}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${activeTab === i ? "bg-cyber-700/40 text-cyber-100" : "text-slate-400 hover:text-white"}`}
            >
              {tab} <span className="ml-1 text-xs text-slate-500">({tabData[i].length})</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <input className="input max-w-xs text-sm" placeholder={`Search ${TABS[activeTab].toLowerCase()}…`} value={query} onChange={(e) => setQuery(e.target.value)} />
          <button
            className={`btn-secondary flex items-center gap-2 text-xs ${filterFailed ? "border-red-500 text-red-400" : ""}`}
            onClick={() => setFilterFailed(!filterFailed)}
          >
            <Filter size={12} /> {filterFailed ? "Showing failures" : "Filter failures"}
          </button>
          <button className="btn-secondary flex items-center gap-2 text-xs ml-auto" onClick={handleExport}>
            <Download size={12} /> Export CSV
          </button>
        </div>

        <DataTable columns={tabCols[activeTab]} data={filteredData} />
      </div>
    </div>
  );
};

export default AccessLogsPage;
