import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "./api.js";
import { Plus, Zap, RefreshCw, X } from "lucide-react";

const statusColor = (s) => s === "CONNECTED" ? "text-green-400 bg-green-500/10 border-green-500/30" : s === "DEGRADED" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" : "text-slate-400 bg-slate-700/30 border-slate-700";
const syncBadge = (s) => s === "SYNCED" ? "text-green-400" : s === "PENDING" ? "text-yellow-400" : "text-slate-400";

const EMPTY_FORM = { name: "", protocol: "OAUTH2", tenantId: "", clientId: "", domain: "", metadataUrl: "" };

const IdentityProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(null);

  const fetchProviders = () =>
    api.get("/providers").then((r) => setProviders(r.data.data)).catch(() => setProviders([]));

  useEffect(() => { fetchProviders(); }, []);

  const handleTest = async (id) => {
    setTesting(id);
    try {
      const r = await api.post(`/providers/${id}/test`);
      toast.success(r.data.message || "Connection test passed!");
      fetchProviders();
    } catch {
      toast.error("Connection test failed.");
    } finally {
      setTesting(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Provider name is required"); return; }
    setSaving(true);
    try {
      await api.post("/providers", { ...form, status: "CONNECTED", syncStatus: "SYNCED", enabled: true });
      toast.success("Provider configuration saved");
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchProviders();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save provider");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title">Identity Provider Integration</h1>
          <p className="text-sm text-slate-400 mt-1">Configure and manage enterprise IdP connections</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add Provider
        </button>
      </div>

      {/* Provider cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {providers.map((p) => (
          <div key={p._id} className="glass rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-base text-white">{p.name}</h3>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${statusColor(p.status)}`}>{p.status}</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between"><span>Protocol</span><span className="text-slate-300 font-medium">{p.protocol}</span></div>
              <div className="flex justify-between"><span>Domain</span><span className="text-slate-300 font-mono">{p.domain}</span></div>
              <div className="flex justify-between"><span>Sync</span><span className={`font-semibold ${syncBadge(p.syncStatus)}`}>{p.syncStatus}</span></div>
              <div className="flex justify-between"><span>Tenant</span><span className="text-slate-300 font-mono">{p.tenantId}</span></div>
            </div>
            {p.groupRoleMappings?.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Group → Role Mappings</p>
                {p.groupRoleMappings.map((m) => (
                  <div key={m.groupName} className="text-xs text-slate-400 flex gap-1">
                    <span className="text-slate-300">{m.groupName}</span> → <span className="text-cyber-400">{m.mappedRole}</span>
                  </div>
                ))}
              </div>
            )}
            {p.testConnectionResult && (
              <p className="text-xs text-slate-500 italic">{p.testConnectionResult}</p>
            )}
            <button
              className="btn-secondary w-full flex items-center justify-center gap-2 text-xs mt-1 disabled:opacity-60"
              onClick={() => handleTest(p._id)}
              disabled={testing === p._id}
            >
              {testing === p._id
                ? <><span className="h-3 w-3 rounded-full border-2 border-slate-400 border-t-white animate-spin" /> Testing…</>
                : <><Zap size={12} /> Test Connection</>}
            </button>
          </div>
        ))}
      </div>

      {/* Metadata URL reference */}
      <div className="glass rounded-xl p-5">
        <h3 className="font-display text-base text-white mb-3">IdP Metadata URL Reference</h3>
        <div className="space-y-2 font-mono text-xs text-slate-400">
          <div className="rounded-lg bg-slate-950 border border-slate-800 px-4 py-2">Azure AD: https://login.microsoftonline.com/&#123;tenant&#125;/v2.0/.well-known/openid-configuration</div>
          <div className="rounded-lg bg-slate-950 border border-slate-800 px-4 py-2">Okta: https://&#123;org&#125;.okta.com/app/&#123;appId&#125;/sso/saml/metadata</div>
          <div className="rounded-lg bg-slate-950 border border-slate-800 px-4 py-2">Active Directory: ldap://&#123;dc01.domain.local&#125;:389</div>
        </div>
      </div>

      {/* Add Provider Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="glass w-full max-w-lg rounded-2xl p-7 shadow-panel">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-white">Add Identity Provider</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Provider Name</label>
                <input className="input" required placeholder="e.g. OKTA_PROD" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Protocol</label>
                <select className="input" value={form.protocol} onChange={(e) => setForm({ ...form, protocol: e.target.value })}>
                  <option value="OAUTH2">OAuth2 / OIDC</option>
                  <option value="SAML">SAML 2.0</option>
                  <option value="LDAP">LDAP</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Tenant ID</label>
                  <input className="input" placeholder="tenant-id" value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Client ID</label>
                  <input className="input" placeholder="client-id" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Domain</label>
                <input className="input" placeholder="company.okta.com" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Metadata URL</label>
                <input className="input" placeholder="https://..." value={form.metadataUrl} onChange={(e) => setForm({ ...form, metadataUrl: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60" disabled={saving}>
                  {saving ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</> : "Save Provider"}
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

export default IdentityProvidersPage;
