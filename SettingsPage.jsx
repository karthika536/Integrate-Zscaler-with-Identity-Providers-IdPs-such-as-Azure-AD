import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "./api.js";
import { Save } from "lucide-react";

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => {
      setSettings(r.data.data);
      setForm(r.data.data);
    }).catch(() => {
      const def = { organizationName: "Nimbus Enterprise", enforceMfa: true, sessionTimeoutMinutes: 30, emailNotifications: true, slackNotifications: true, defaultProvider: "AZURE_AD" };
      setSettings(def); setForm(def);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/settings", form);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ field, label, desc }) => (
    <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/30 px-5 py-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => setForm({ ...form, [field]: !form[field] })}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${form[field] ? "bg-cyber-500" : "bg-slate-700"}`}
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form[field] ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );

  if (loading) return <div className="text-slate-400 text-sm p-6">Loading settings…</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h1 className="section-title">Organisation Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure platform-wide security and notification preferences</p>
      </div>

      {/* Org info */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-display text-base text-white">Organisation Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Organisation Name</label>
            <input className="input" value={form.organizationName || ""} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} placeholder="Company Name" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Default Identity Provider</label>
            <select className="input" value={form.defaultProvider || "AZURE_AD"} onChange={(e) => setForm({ ...form, defaultProvider: e.target.value })}>
              <option value="AZURE_AD">Azure AD</option>
              <option value="OKTA">Okta</option>
              <option value="ACTIVE_DIRECTORY">Active Directory</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Session Timeout (minutes)</label>
            <input type="number" className="input" min={5} max={480} value={form.sessionTimeoutMinutes || 30} onChange={(e) => setForm({ ...form, sessionTimeoutMinutes: Number(e.target.value) })} />
          </div>
        </div>
      </div>

      {/* Security toggles */}
      <div className="glass rounded-2xl p-6 space-y-3">
        <h3 className="font-display text-base text-white mb-1">Security Preferences</h3>
        <Toggle field="enforceMfa" label="Enforce MFA" desc="Require multi-factor authentication for all users at login" />
        <Toggle field="allowLegacyAuth" label="Allow Legacy Auth" desc="Enable basic auth for old clients (not recommended)" />
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-6 space-y-3">
        <h3 className="font-display text-base text-white mb-1">Notification Channels</h3>
        <Toggle field="emailNotifications" label="Email Notifications" desc="Send security alerts and access event summaries via email" />
        <Toggle field="slackNotifications" label="Slack Notifications" desc="Post alerts to the configured Slack security channel" />
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary flex items-center gap-2 disabled:opacity-60" disabled={saving}>
          {saving ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</> : <><Save size={14} /> Save Settings</>}
        </button>
        <button type="button" className="btn-secondary text-sm" onClick={() => setForm(settings)}>Reset Changes</button>
      </div>
    </form>
  );
};

export default SettingsPage;
