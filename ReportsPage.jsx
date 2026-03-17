import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "./api.js";
import DataTable from "./DataTable.jsx";
import { Plus, Download, FileText, X } from "lucide-react";

const REPORT_TYPES = ["AUTH_SUMMARY", "POLICY_COMPLIANCE", "USER_ACTIVITY", "INCIDENT_REPORT"];
const FORMATS = ["PDF", "CSV", "JSON"];
const EMPTY = { title: "", type: "AUTH_SUMMARY", format: "PDF" };

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchReports = () =>
    api.get("/reports").then((r) => setReports(r.data.data)).catch(() => setReports([]));

  useEffect(() => { fetchReports(); }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Report title is required"); return; }
    setSaving(true);
    try {
      await api.post("/reports/generate", { ...form, summary: `Auto-generated ${form.type} report`, generatedById: "current-user" });
      toast.success("Report generated successfully");
      setShowModal(false);
      setForm(EMPTY);
      fetchReports();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate report");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = (report) => {
    const content = JSON.stringify(report, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${report.title}.${report.format?.toLowerCase() || "json"}`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`${report.format} download triggered`);
  };

  const statusBadge = (s) => (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold border ${s === "READY" ? "text-green-400 bg-green-500/10 border-green-500/30" : "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"}`}>{s || "READY"}</span>
  );

  const columns = [
    { key: "title", label: "Report Title", render: (r) => <span className="font-medium text-white">{r.title}</span> },
    { key: "type", label: "Type", render: (r) => <span className="font-mono text-xs text-slate-300">{r.type}</span> },
    { key: "format", label: "Format" },
    { key: "status", label: "Status", render: (r) => statusBadge(r.status) },
    { key: "summary", label: "Summary", render: (r) => <span className="text-xs text-slate-400 max-w-[200px] truncate block">{r.summary}</span> },
    { key: "createdAt", label: "Generated", render: (r) => new Date(r.createdAt).toLocaleDateString() },
    { key: "download", label: "Download", render: (r) => (
      <button className="flex items-center gap-1 text-xs text-cyber-400 hover:text-cyber-200 transition-colors" onClick={() => handleDownload(r)}>
        <Download size={12} /> {r.format || "JSON"}
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title">Reports & Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Generate and download compliance and activity reports</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Generate Report
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Total Reports</p>
          <p className="font-display text-2xl font-bold text-white mt-1">{reports.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Ready to Download</p>
          <p className="font-display text-2xl font-bold text-green-400 mt-1">{reports.filter((r) => r.status === "READY" || !r.status).length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Report Types</p>
          <p className="font-display text-2xl font-bold text-cyber-400 mt-1">{[...new Set(reports.map((r) => r.type))].length}</p>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <DataTable columns={columns} data={reports} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-2xl p-7 shadow-panel">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-white flex items-center gap-2">
                <FileText size={18} className="text-cyber-400" /> Generate Report
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Report Title</label>
                <input className="input" required placeholder="e.g. Q1 Compliance Summary" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Report Type</label>
                <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {REPORT_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Format</label>
                <select className="input" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                  {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60" disabled={saving}>
                  {saving ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Generating...</> : "Generate"}
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

export default ReportsPage;
