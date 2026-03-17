import { Shield, Users, Globe, Lock, Activity, FileText, Key, Eye, Zap, Server, CheckCircle, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: Globe,
    category: "Identity Federation",
    title: "Multi-IdP SSO Simulation",
    desc: "Simulates enterprise Single Sign-On across Azure AD (OAuth2), Okta (SAML), and Active Directory (LDAP). Each IdP has its own group-to-role mapping configuration and sync status.",
    badges: ["Azure AD", "Okta", "LDAP"],
  },
  {
    icon: Key,
    category: "Authentication",
    title: "JWT Session Management",
    desc: "Stateless JWT tokens with 8-hour expiry. bcrypt password hashing, secure Bearer header transmission, and automatic session expiry with toast notification for security demo.",
    badges: ["JWT", "bcryptjs", "Auto-Expiry"],
  },
  {
    icon: Users,
    category: "Access Control",
    title: "5-Role RBAC System",
    desc: "Super Admin, Security Admin, IT Admin, Employee, and Auditor roles with granular permission sets. Route-level guards using RoleGuard and ProtectedRoute wrapper components.",
    badges: ["RBAC", "5 Roles", "Route Guards"],
  },
  {
    icon: Shield,
    category: "Policy Engine",
    title: "Zscaler Policy Simulation",
    desc: "Conditional access policies evaluate MFA status, device compliance posture, network context, and role/department assignment to produce ALLOW or DENY access decisions.",
    badges: ["MFA", "Device Posture", "Segmentation"],
  },
  {
    icon: Activity,
    category: "Monitoring",
    title: "3-Layer Logging System",
    desc: "Captures Authentication Logs (SSO attempts), Access Logs (app-level GRANTED/DENIED decisions), and Audit Logs (admin actions) in real-time with actor attribution.",
    badges: ["Auth Logs", "Access Logs", "Audit Trail"],
  },
  {
    icon: FileText,
    category: "Reporting",
    title: "Compliance Report Generation",
    desc: "Generate AUTH_SUMMARY and POLICY_COMPLIANCE reports on-demand. UI provides download actions for PDF and CSV formats with report title, generator, and status tracking.",
    badges: ["PDF", "CSV", "On-Demand"],
  },
  {
    icon: Lock,
    category: "Security",
    title: "Privilege Escalation Control",
    desc: "Role escalation simulation where employees can request temporary admin access. Approval flow with expiry recorded in the audit log for compliance evidence capture.",
    badges: ["Escalation", "Approval Flow", "Audit"],
  },
  {
    icon: Server,
    category: "Infrastructure",
    title: "In-Memory Data Architecture",
    desc: "Zero-dependency in-memory store with full CRUD support, relation simulation (embedded objects), and session-scoped persistence. No MongoDB or external DB required.",
    badges: ["No DB Needed", "CRUD", "Seeded Data"],
  },
  {
    icon: Eye,
    category: "Dashboard",
    title: "Real-Time Analytics Dashboard",
    desc: "KPI stat cards, provider health indicators, access trend bar charts, and provider distribution pie charts built with Recharts. Data served from the backend API.",
    badges: ["Recharts", "KPIs", "Live API"],
  },
  {
    icon: Zap,
    category: "UX",
    title: "Responsive Admin Console",
    desc: "Fully responsive dashboard layout with collapsible sidebar, global search bar, notification bell, and glassmorphism design system using custom TailwindCSS tokens.",
    badges: ["Dark Mode", "Responsive", "Glassmorphism"],
  },
];

const demoAccounts = [
  { email: "superadmin@nimbus.com", role: "Super Admin", access: "Full platform access", color: "text-red-400" },
  { email: "security.admin@nimbus.com", role: "Security Admin", access: "Policies + Logs + Providers", color: "text-orange-400" },
  { email: "it.admin@nimbus.com", role: "IT Admin", access: "Users + Providers + Logs", color: "text-yellow-400" },
  { email: "employee@nimbus.com", role: "Employee", access: "Dashboard only", color: "text-green-400" },
  { email: "auditor@nimbus.com", role: "Auditor", access: "Logs + Reports (read-only)", color: "text-blue-400" },
];

const FeaturesPage = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-20">

      {/* Header */}
      <section>
        <h1 className="font-display text-4xl text-white">Platform Features</h1>
        <p className="mt-4 text-slate-400 max-w-2xl text-lg">
          A complete demonstration of enterprise ZTNA — every feature is backed by live API calls to the Express backend.
        </p>
      </section>

      {/* Feature grid */}
      <section className="grid gap-5 md:grid-cols-2">
        {features.map(({ icon: Icon, category, title, desc, badges }) => (
          <div key={title} className="glass rounded-2xl p-6 hover:border-cyber-500/40 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-500/15 text-cyber-400 group-hover:bg-cyber-500/25 transition-colors">
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-cyber-400 font-medium uppercase tracking-wider mb-1">{category}</p>
                <h3 className="font-display text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {badges.map((b) => (
                    <span key={b} className="inline-flex rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Demo accounts */}
      <section>
        <h2 className="font-display text-2xl text-white mb-6 flex items-center gap-2">
          <Key size={20} className="text-cyber-400" /> Demo Login Credentials
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-900/80 px-4 py-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
            <span>Email</span><span>Role</span><span>Access Scope</span>
          </div>
          {demoAccounts.map((acc) => (
            <div key={acc.email} className="grid grid-cols-3 border-t border-slate-800 px-4 py-4 text-sm hover:bg-slate-800/30 transition-colors">
              <span className="font-mono text-xs text-slate-300">{acc.email}</span>
              <span className={`font-semibold ${acc.color}`}>{acc.role}</span>
              <span className="text-slate-400">{acc.access}</span>
            </div>
          ))}
          <div className="border-t border-slate-800 bg-slate-900/50 px-4 py-3 flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle size={12} className="text-green-500" />
            Password for all accounts: <span className="font-mono text-slate-300 ml-1">Password@123</span>
            <AlertTriangle size={12} className="text-yellow-500 ml-3" />
            SSO login requires matching email + provider combination.
          </div>
        </div>
      </section>

    </div>
  );
};

export default FeaturesPage;
