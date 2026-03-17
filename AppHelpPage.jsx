import { useState } from "react";
import { ChevronDown, BookOpen, Shield, User, HelpCircle, Code } from "lucide-react";

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-800 last:border-0">
      <button className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white hover:text-cyber-100 transition-colors" onClick={() => setOpen(!open)}>
        {q}
        <ChevronDown size={15} className={`shrink-0 ml-3 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{a}</div>}
    </div>
  );
};

const faqs = [
  { q: "How do I navigate to a specific page?", a: "Use the left sidebar navigation in the admin console. All sections are listed: Dashboard, Users, Roles, Providers, Policies, Logs, Reports, Settings, and Profile." },
  { q: "Why is a page showing 'Access Denied'?", a: "Your role may not have permission to access that page. EMPLOYEE can only view the Dashboard. Upgrade to IT_ADMIN or SECURITY_ADMIN to unlock Users/Providers/Logs. Sign in with superadmin@nimbus.com for full access." },
  { q: "How does SSO login simulation work?", a: "On the login page, enter an email and select an enterprise IdP. The backend checks if the email is linked to that provider. Each demo account is pre-linked: superadmin→AZURE_AD, security.admin→OKTA, it.admin→ACTIVE_DIRECTORY." },
  { q: "Can I create and delete users?", a: "Yes — go to User Management (requires SUPER_ADMIN or IT_ADMIN role). Use 'Create User' to set name, email, role, and provider. Use the Edit and Delete buttons in the table rows." },
  { q: "How do I test an IdP connection?", a: "Navigate to Identity Providers. Each provider card has a 'Test Connection' button. Click it to simulate a metadata check — the status updates to CONNECTED and sync to SYNCED." },
  { q: "How are policies enforced?", a: "When a user logs in via SSO, the backend evaluates their role/department against active Zscaler policies. Access is GRANTED or DENIED based on conditions like MFA, device posture, and network. Results appear in Access Logs." },
  { q: "How do I generate a compliance report?", a: "Go to Reports and click 'Generate Report'. Choose a report type (AUTH_SUMMARY, POLICY_COMPLIANCE, etc.) and format (PDF, CSV, JSON). Click Generate. Download using the download icon in the table." },
  { q: "Does data persist when the server restarts?", a: "No — the demo uses an in-memory store. All data resets on server restart. This is by design for a zero-infrastructure demo." },
];

const shortcuts = [
  { keys: ["Ctrl", "K"], desc: "Open search (UI shortcut)" },
  { keys: ["Alt", "D"], desc: "Go to Dashboard" },
  { keys: ["Alt", "U"], desc: "Go to User Management" },
  { keys: ["Alt", "L"], desc: "Go to Logs" },
];

const AppHelpPage = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="section-title">Documentation Center</h1>
        <p className="text-sm text-slate-400 mt-1">Admin workflows, feature guides, and platform FAQs</p>
      </div>

      {/* Quick start */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg text-white mb-4 flex items-center gap-2">
          <Code size={16} className="text-cyber-400" /> Quick Start Reference
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { role: "Super Admin", email: "superadmin@nimbus.com", note: "Full access to all features" },
            { role: "Security Admin", email: "security.admin@nimbus.com", note: "Policies + Logs + Providers" },
            { role: "IT Admin", email: "it.admin@nimbus.com", note: "Users + Providers + Logs" },
            { role: "Auditor", email: "auditor@nimbus.com", note: "Read-only Logs + Reports" },
          ].map((u) => (
            <div key={u.email} className="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-3">
              <p className="text-sm font-semibold text-cyber-100">{u.role}</p>
              <p className="text-xs font-mono text-slate-400">{u.email}</p>
              <p className="text-xs text-slate-600 mt-0.5">{u.note}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3">Password for all: <span className="text-slate-400 font-mono">Password@123</span></p>
      </div>

      {/* Feature guides */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-base text-white mb-3 flex items-center gap-2"><Shield size={15} className="text-cyber-400" /> Admin Module Guide</h3>
          <ul className="space-y-2.5">
            {[
              ["Users", "Create, edit, delete, search users with role assignment"],
              ["Identity Providers", "Configure IdP, test connections, view group mappings"],
              ["Zscaler Policies", "Create ALLOW/DENY access rules with posture conditions"],
              ["Access Logs", "View GRANTED/DENIED events, auth attempts, admin actions"],
              ["Reports", "Generate and download compliance reports on demand"],
              ["Settings", "Configure MFA enforcement, session timeout, notifications"],
            ].map(([title, desc]) => (
              <li key={title} className="text-sm">
                <span className="font-medium text-white">{title}</span>
                <span className="text-slate-500"> — </span>
                <span className="text-slate-400">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-base text-white mb-3 flex items-center gap-2"><User size={15} className="text-cyber-400" /> User Workflow Guide</h3>
          <ol className="space-y-2.5">
            {[
              "Open the login page and enter your email and password",
              "Optionally select an SSO provider (Azure AD, Okta, AD)",
              "You land on the Security Operations Dashboard",
              "View KPI stats, provider health, and access trends",
              "Go to Profile to update your name or change your password",
              "Session auto-expires after 30 minutes — you'll be prompted to re-login",
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-400">
                <span className="shrink-0 h-5 w-5 rounded-full bg-cyber-500/15 text-cyber-400 text-xs flex items-center justify-center">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-display text-lg text-white mb-4 flex items-center gap-2">
          <HelpCircle size={16} className="text-cyber-400" /> Frequently Asked Questions
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          {faqs.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </div>
    </div>
  );
};

export default AppHelpPage;
