import { useState } from "react";
import { ChevronDown, BookOpen, Shield, User, HelpCircle } from "lucide-react";

const faqs = [
  { q: "What is Zero Trust Network Access (ZTNA)?", a: "ZTNA is a security model where no user or device is trusted by default — every access request is verified against identity, device posture, and policy before granting access to applications." },
  { q: "What Identity Providers are supported?", a: "The platform simulates federation with Azure AD (OAuth2/OIDC), Okta (SAML 2.0), and Active Directory (LDAP). Each IdP has configurable group-to-role mappings." },
  { q: "How does SSO login work in the demo?", a: "Select an IdP from the login page and enter an email linked to that provider. The backend validates the email-provider mapping and issues a JWT. SSO is simulated — no real federation handshake occurs." },
  { q: "What are the demo login credentials?", a: "All accounts use Password@123. Emails: superadmin@nimbus.com, security.admin@nimbus.com, it.admin@nimbus.com, employee@nimbus.com, auditor@nimbus.com." },
  { q: "Is any database or external service required to run this?", a: "No. The backend uses a pure in-memory JavaScript store. Start with `node server.js` and `npx vite` — no MongoDB, Redis, or cloud service needed." },
  { q: "How does the Zscaler policy engine work?", a: "Policies define ALLOW/DENY rules with conditions like MFA required, device posture (COMPLIANT/NON_COMPLIANT), assigned roles/departments, and app category. Access log entries record the policy applied per request." },
  { q: "What resets when the server restarts?", a: "All data resets to default because it's in-memory. Re-run `node server.js` to get fresh demo data. No persistent state is maintained between sessions." },
  { q: "Which roles can see which pages?", a: "SUPER_ADMIN sees everything. SECURITY_ADMIN manages policies/logs/providers. IT_ADMIN manages users/providers. EMPLOYEE sees dashboard only. AUDITOR sees logs and reports (read-only)." },
];

const guides = [
  {
    icon: User,
    title: "Employee / End-User Guide",
    steps: [
      "Navigate to Login and enter your email + password, or choose an SSO provider.",
      "After login, you land on the Security Operations Dashboard with KPI metrics.",
      "View your active session context and provider in the top header.",
      "Use Profile to update your name or change your password.",
      "Session auto-expires after 30 minutes of inactivity for security.",
    ],
  },
  {
    icon: Shield,
    title: "Admin / IT Admin Guide",
    steps: [
      "Log in as superadmin@nimbus.com or it.admin@nimbus.com.",
      "Go to User Management to create, search, and manage user accounts.",
      "Navigate to Identity Providers to configure IdP settings and test connections.",
      "Use Zscaler Policies to create ALLOW/DENY rules with conditions.",
      "Review Access Logs for GRANTED/DENIED records and Auth Logs for SSO attempts.",
      "Generate compliance reports from the Reports page.",
      "Adjust org-wide settings (MFA enforcement, session timeout) in Settings.",
    ],
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-800 last:border-0">
      <button
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white hover:text-cyber-100 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {q}
        <ChevronDown size={16} className={`shrink-0 ml-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};

const HelpPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
      <section>
        <h1 className="font-display text-4xl text-white">Help & Documentation</h1>
        <p className="mt-3 text-slate-400 max-w-xl">Guides, walkthroughs, and answers to common questions about the Zscaler IdP Fusion platform.</p>
      </section>

      {/* Guides */}
      <section>
        <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
          <BookOpen size={18} className="text-cyber-400" /> Getting Started Guides
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {guides.map(({ icon: Icon, title, steps }) => (
            <div key={title} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-9 w-9 rounded-lg bg-cyber-500/15 flex items-center justify-center text-cyber-400">
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-base text-white">{title}</h3>
              </div>
              <ol className="space-y-2.5">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-400">
                    <span className="shrink-0 h-5 w-5 rounded-full bg-cyber-500/20 text-cyber-400 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Quick reference */}
      <section className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg text-white mb-4">Quick Reference — How to Run Locally</h2>
        <div className="space-y-2 font-mono text-xs">
          {[
            { cmd: "cd P2", desc: "· enter project folder" },
            { cmd: "npm install", desc: "· install all dependencies" },
            { cmd: "node server.js", desc: "· start backend on :5000" },
            { cmd: "npx vite", desc: "· start frontend on :5173" },
          ].map(({ cmd, desc }) => (
            <div key={cmd} className="flex items-center gap-3 rounded-lg bg-slate-950 border border-slate-800 px-4 py-2">
              <span className="text-green-400">$</span>
              <span className="text-cyber-100">{cmd}</span>
              <span className="text-slate-600 ml-auto">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
          <HelpCircle size={18} className="text-cyber-400" /> Frequently Asked Questions
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          {faqs.map((faq) => <FaqItem key={faq.q} {...faq} />)}
        </div>
      </section>
    </div>
  );
};

export default HelpPage;
