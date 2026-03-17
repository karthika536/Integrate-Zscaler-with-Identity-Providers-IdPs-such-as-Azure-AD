import { useState } from "react";
import { toast } from "react-toastify";
import api from "./api.js";
import { CheckCircle } from "lucide-react";

const MATRIX = [
  {
    name: "SUPER_ADMIN", label: "Super Admin", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30",
    permissions: ["MANAGE_USERS", "MANAGE_ROLES", "MANAGE_PROVIDERS", "MANAGE_POLICIES", "VIEW_LOGS", "VIEW_REPORTS", "MANAGE_SETTINGS"],
    dept: "Security Operations", desc: "Full platform ownership and configuration. Can perform all administrative actions.",
  },
  {
    name: "SECURITY_ADMIN", label: "Security Admin", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30",
    permissions: ["MANAGE_PROVIDERS", "MANAGE_POLICIES", "VIEW_LOGS", "VIEW_REPORTS"],
    dept: "Security Operations", desc: "Manages zero trust policies, IdP config, compliance monitoring, and access analytics.",
  },
  {
    name: "IT_ADMIN", label: "IT Admin", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30",
    permissions: ["MANAGE_USERS", "MANAGE_PROVIDERS", "VIEW_LOGS"],
    dept: "IT Infrastructure", desc: "Handles user lifecycle operations, provider connections, and infrastructure access logs.",
  },
  {
    name: "EMPLOYEE", label: "Employee", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30",
    permissions: ["VIEW_DASHBOARD", "VIEW_PROFILE"],
    dept: "All departments", desc: "End-user access to the dashboard, own profile, and application access via policy evaluation.",
  },
  {
    name: "AUDITOR", label: "Auditor", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30",
    permissions: ["VIEW_LOGS", "VIEW_REPORTS"],
    dept: "Audit & Compliance", desc: "Read-only visibility into logs, access records, and compliance reporting for governance.",
  },
];

const ALL_PERMS = ["MANAGE_USERS", "MANAGE_ROLES", "MANAGE_PROVIDERS", "MANAGE_POLICIES", "VIEW_LOGS", "VIEW_REPORTS", "MANAGE_SETTINGS", "VIEW_DASHBOARD", "VIEW_PROFILE"];

const RoleManagementPage = () => {
  const [selected, setSelected] = useState(null);
  const [escalating, setEscalating] = useState(false);
  const [escalated, setEscalated] = useState(false);

  const handleEscalate = async () => {
    setEscalating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setEscalating(false);
    setEscalated(true);
    toast.success("Escalation approved and audit log recorded (simulated)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Role & Authorization Management</h1>
        <p className="text-sm text-slate-400 mt-1">5-role RBAC model governing platform-wide access and permissions</p>
      </div>

      {/* Role cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MATRIX.map((role) => (
          <button
            key={role.name}
            className={`glass rounded-xl p-5 text-left hover:border-cyber-500/40 transition-colors ${selected?.name === role.name ? "border-cyber-500/50" : ""}`}
            onClick={() => setSelected(selected?.name === role.name ? null : role)}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${role.bg} ${role.color}`}>{role.label}</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{role.desc}</p>
            <p className="text-xs text-slate-500">Dept scope: <span className="text-slate-300">{role.dept}</span></p>
          </button>
        ))}
      </div>

      {/* Permission matrix detail */}
      {selected && (
        <div className="glass rounded-2xl p-6 border-cyber-500/30">
          <h3 className="font-display text-lg text-white mb-4">Permission Matrix — <span className={selected.color}>{selected.label}</span></h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_PERMS.map((perm) => {
              const has = selected.permissions.includes(perm);
              return (
                <div key={perm} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${has ? "border-cyber-700/40 bg-cyber-500/5 text-cyber-100" : "border-slate-800 text-slate-600"}`}>
                  <CheckCircle size={13} className={has ? "text-cyber-400" : "text-slate-700"} />
                  {perm.replace(/_/g, " ")}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Privilege escalation simulation */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-lg text-white mb-2">Privilege Escalation Simulation</h3>
        <p className="text-sm text-slate-400 mb-5">
          Simulates the workflow where an EMPLOYEE requests temporary IT_ADMIN access for a maintenance task.
          The Security Admin approves with automatic expiry, and the event is logged in the audit trail.
        </p>
        <div className="grid gap-4 sm:grid-cols-3 mb-5 text-sm">
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-500 mb-1">Requester</p>
            <p className="font-semibold text-white">Neha Patel</p>
            <p className="text-xs text-green-400">EMPLOYEE → IT_ADMIN (1h)</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-500 mb-1">Approver</p>
            <p className="font-semibold text-white">Sara Khan</p>
            <p className="text-xs text-orange-400">SECURITY_ADMIN</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-500 mb-1">Status</p>
            <p className={`font-semibold ${escalated ? "text-green-400" : "text-yellow-400"}`}>{escalated ? "Approved & Logged" : "Pending Review"}</p>
            <p className="text-xs text-slate-500">Reason: Patch deployment task</p>
          </div>
        </div>
        {!escalated ? (
          <button className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60" onClick={handleEscalate} disabled={escalating}>
            {escalating ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Processing...</> : "Approve Escalation Request"}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <CheckCircle size={16} /> Escalation approved — audit log entry created (check Access Logs)
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagementPage;
