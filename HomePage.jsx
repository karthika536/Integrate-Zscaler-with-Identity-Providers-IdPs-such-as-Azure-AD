import { Link } from "react-router-dom";
import { Shield, Lock, Globe, ChevronRight, Users, FileText, Activity, CheckCircle } from "lucide-react";

const stats = [
  { label: "Identity Providers", value: "3 IdPs", sub: "Azure AD · Okta · Active Directory" },
  { label: "Policy Engine Rules", value: "12+", sub: "Zero Trust posture checks" },
  { label: "Compliance Score", value: "93%", sub: "Across all managed devices" },
  { label: "Audit Events", value: "Real-time", sub: "Continuous access monitoring" },
];

const workflow = [
  { step: "01", title: "Identity Selection", desc: "User selects enterprise IdP — Azure AD, Okta, or Active Directory." },
  { step: "02", title: "Federation & Auth", desc: "IdP validates identity via OAuth2, SAML, or LDAP protocol." },
  { step: "03", title: "Role & Group Mapping", desc: "User groups are mapped to platform roles with scoped permissions." },
  { step: "04", title: "Policy Evaluation", desc: "Zscaler engine checks MFA, device posture & location context." },
  { step: "05", title: "Access Decision", desc: "Application access is GRANTED or DENIED with full audit trail." },
];

const highlights = [
  { icon: Shield, title: "Zero Trust Architecture", desc: "Never trust, always verify — every request evaluated against posture policies." },
  { icon: Users, title: "Multi-IdP Federation", desc: "Centralized control over Azure AD, Okta, and Active Directory identities." },
  { icon: Lock, title: "RBAC Enforcement", desc: "Role-based permissions scoped to departments with privilege escalation flows." },
  { icon: Globe, title: "Secure Segmentation", desc: "App-level segmentation ensuring users only reach what they're authorized for." },
  { icon: Activity, title: "Live Audit Monitoring", desc: "Auth logs, access records, and audit trails captured for compliance reporting." },
  { icon: FileText, title: "Compliance Reporting", desc: "Exportable PDF/CSV compliance snapshots for evidence and governance review." },
];

const HomePage = () => {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-900/40 via-transparent to-slate-950 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 py-24 relative">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyber-500/40 bg-cyber-500/10 px-4 py-1.5 text-xs font-medium text-cyber-100 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-cyber-500 animate-pulse" />
                Final Year Project · Zero Trust Access Governance
              </span>
              <h1 className="font-display text-4xl leading-tight md:text-5xl lg:text-6xl text-white">
                Unified Enterprise Access via{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-500 to-blue-400">
                  Zscaler IdP Fusion
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-slate-300 text-lg leading-relaxed">
                A production-style demonstration platform for centralized authentication, role mapping,
                Zscaler policy enforcement, and secure application segmentation using identity federation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" className="btn-primary flex items-center gap-2 text-sm">
                  Try Live Demo <ChevronRight size={14} />
                </Link>
                <Link to="/architecture" className="btn-secondary text-sm">
                  View Architecture
                </Link>
                <Link to="/features" className="btn-secondary text-sm">
                  Explore Features
                </Link>
              </div>
              <p className="mt-5 text-xs text-slate-500">
                Demo credentials pre-filled on login page. Password for all: <span className="text-slate-400 font-medium">Password@123</span>
              </p>
            </div>

            {/* Workflow card */}
            <div className="glass rounded-2xl p-6 shadow-panel space-y-3">
              <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                <Shield className="text-cyber-500" size={18} /> Secure Access Workflow
              </h3>
              {workflow.map((item) => (
                <div key={item.step} className="flex gap-4 items-start rounded-xl bg-slate-800/40 border border-slate-700/50 p-3">
                  <span className="text-xs font-bold text-cyber-500 font-mono mt-0.5 min-w-[24px]">{item.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-slate-800/60 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-cyber-100">{s.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature highlights ── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl text-white">Everything in One Platform</h2>
          <p className="mt-3 text-slate-400 max-w-lg mx-auto">
            From identity federation to policy enforcement and compliance reporting — end to end.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6 hover:border-cyber-500/40 transition-colors group">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-500/15 text-cyber-400 group-hover:bg-cyber-500/25 transition-colors">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="glass rounded-2xl p-10 text-center shadow-panel border-cyber-500/20">
          <h2 className="font-display text-2xl text-white">Ready to explore the platform?</h2>
          <p className="mt-3 text-slate-400">Sign in with a demo account and experience the full Zero Trust workflow.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="btn-primary flex items-center gap-2">
              <CheckCircle size={14} /> Launch Demo Portal
            </Link>
            <Link to="/about" className="btn-secondary">Learn About the Project</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
