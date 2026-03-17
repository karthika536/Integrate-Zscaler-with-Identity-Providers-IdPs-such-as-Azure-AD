import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "./api.js";
import DataTable from "./DataTable.jsx";
import { Plus, X, Shield } from "lucide-react";

const ACTIONS = ["ALLOW", "DENY"];
const CATEGORIES = ["APP_ACCESS", "SEGMENTATION", "DEVICE_POSTURE", "MFA_ENFORCEMENT"];
const ROLES_LIST = ["SUPER_ADMIN", "SECURITY_ADMIN", "IT_ADMIN", "EMPLOYEE", "AUDITOR"];
const EMPTY = { name: "", description: "", category: "APP_ACCESS", action: "ALLOW", conditionSummary: "", complianceScore: 90, enabled: true };

const ZscalerPoliciesPage = () => {
  const [policies, setPolicies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchPolicies = () =>
    api.get("/policies").then((r) => setPolicies(r.data.data)).catch(() => setPolicies([]));

  useEffect(() => { fetchPolicies(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Policy name required"); return; }
    setSaving(true);
    try {
      await api.post("/policies", form);
      toast.success("Policy created successfully");
      setShowModal(false);
      setForm(EMPTY);
      fetchPolicies();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create policy");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (p) => {
    try {
      await api.put(`/policies/${p._id}`, { enabled: !p.enabled });
      toast.success(`Policy ${!p.enabled ? "enabled" : "disabled"}`);
      fetchPolicies();
    } catch { toast.error("Toggle failed"); }
  };

  const actionBadge = (a) => (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold border ${a === "ALLOW" ? "text-green-400 bg-green-500/10 border-green-500/30" : "text-red-400 bg-red-500/10 border-red-500/30"}`}>{a}</span>
  );

  const columns = [
    { key: "name", label: "Policy Name", render: (p) => <span className="font-medium text-white">{p.name}</span> },
    { key: "category", label: "Category", render: (p) => <span className="text-xs text-slate-300 font-mono">{p.category}</span> },
    { key: "action", label: "Decision", render: (p) => actionBadge(p.action) },
    { key: "complianceScore", label: "Compliance", render: (p) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full bg-slate-700">
          <div className="h-1.5 rounded-full bg-cyber-500" style={{ width: `${p.complianceScore}%` }} />
        </div>
        <span className="text-xs text-slate-300">{p.complianceScore}%</span>
      </div>
    )},
    { key: "enabled", label: "Status", render: (p) => (
      <button onClick={() => handleToggle(p)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${p.enabled ? "bg-cyber-500" : "bg-slate-700"}`}>
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${p.enabled ? "translate-x-5" : "translate-x-1"}`} />
      </button>
    )},
    { key: "condition", label: "Conditions", render: (p) => <span className="text-xs text-slate-400 max-w-[180px] truncate block">{p.conditionSummary}</span> },
  ];

  const kpis = [
    { label: "Threat Intel", value: "Medium Risk", detail: "4 events flagged today", color: "text-yellow-400" },
    { label: "ZT Compliance", value: "93%", detail: "Across managed assets", color: "text-green-400" },
    { label: "App Segments", value: "3 Zones", detail: "Active segmentation rules", color: "text-cyber-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title">Zscaler Policy Engine</h1>
          <p className="text-sm text-slate-400 mt-1">Conditional access policies applied on every authentication event</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Create Policy
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="glass rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{k.label}</p>
            <p className={`font-display text-xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{k.detail}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4">
        <DataTable columns={columns} data={policies} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="glass w-full max-w-lg rounded-2xl p-7 shadow-panel">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-white flex items-center gap-2">
                <Shield size={18} className="text-cyber-400" /> New Policy
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Policy Name</label>
                <input className="input" required placeholder="e.g. Finance Access Control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Description</label>
                <textarea className="input min-h-[70px] resize-none" placeholder="Describe the policy purpose..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Category</label>
                  <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Action</label>
                  <select className="input" value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}>
                    {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Condition Summary</label>
                <input className="input" placeholder="e.g. MFA required + compliant device" value={form.conditionSummary} onChange={(e) => setForm({ ...form, conditionSummary: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Compliance Score: {form.complianceScore}%</label>
                <input type="range" min="50" max="100" className="w-full accent-cyber-500" value={form.complianceScore} onChange={(e) => setForm({ ...form, complianceScore: Number(e.target.value) })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60" disabled={saving}>
                  {saving ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</> : "Create Policy"}
                </button>
                <button type="button" className="btn-secondary flex-1" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZscalerPoliciesPage;
