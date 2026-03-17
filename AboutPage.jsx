import { Shield, Globe, Lock, FileText, Users, Activity } from "lucide-react";

const tech = [
  { label: "React 18 + Vite", desc: "Fast SPA with HMR, code-splitting, and optimized production builds." },
  { label: "TailwindCSS v3", desc: "Utility-first styling with custom design tokens for glassmorphism UI." },
  { label: "Express.js", desc: "REST API backend with RBAC middleware, JWT auth, and route protection." },
  { label: "In-Memory Store", desc: "Zero-dependency data store — no MongoDB setup needed for demo." },
  { label: "JWT + bcryptjs", desc: "Stateless authentication with hashed passwords and role-encoded tokens." },
  { label: "Recharts + Chart.js", desc: "Interactive dashboards for access trends and provider analytics." },
];

const objectives = [
  { icon: Shield, title: "Zero Trust Principle", desc: "Demonstrate how 'never trust, always verify' works at the identity and policy layer." },
  { icon: Globe, title: "Multi-IdP Integration", desc: "Showcase federation across Azure AD, Okta, and Active Directory with protocol simulation." },
  { icon: Lock, title: "Conditional Access", desc: "Enforce MFA, device posture, and network constraints through Zscaler policy rules." },
  { icon: Users, title: "Role Governance", desc: "Implement RBAC with 5 enterprise roles, permission matrices, and escalation flows." },
  { icon: Activity, title: "Audit & Monitoring", desc: "Capture and surface authentication logs, access records, and admin audit trails." },
  { icon: FileText, title: "Compliance Reporting", desc: "Generate and view compliance snapshots in structured, export-ready formats." },
];

const team = [
  { name: "Final Year Student", role: "Full-Stack Developer", dept: "Computer Science & Engineering" },
  { name: "Project Guide", role: "Faculty Supervisor", dept: "Network Security & Cloud Computing" },
];

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-20">

      {/* ── Intro ── */}
      <section>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyber-500/40 bg-cyber-500/10 px-4 py-1.5 text-xs font-medium text-cyber-100 mb-4">
          Final Year B.Tech Project · 2025–26
        </span>
        <h1 className="font-display text-4xl text-white leading-tight">
          About the Project
        </h1>
        <p className="mt-5 text-slate-300 max-w-3xl text-lg leading-relaxed">
          This project demonstrates how modern enterprises enforce <strong className="text-white">Zero Trust Network Access (ZTNA)</strong> by
          integrating Zscaler's policy engine with multiple Identity Providers — Azure AD, Okta, and Active Directory.
          It simulates the complete lifecycle: authentication, authorization, user provisioning, policy compliance, and audit monitoring
          within a unified platform.
        </p>
        <p className="mt-4 text-slate-400 max-w-3xl leading-relaxed">
          Built as a full-stack web application with a React frontend and an Express backend, the platform provides a
          real-world feel with live API interaction, role-based route protection, and an in-memory data store that
          eliminates any external infrastructure dependency for demonstration purposes.
        </p>
      </section>

      {/* ── Objectives ── */}
      <section>
        <h2 className="font-display text-2xl text-white mb-8">Project Objectives</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {objectives.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-5 hover:border-cyber-500/40 transition-colors">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-500/15 text-cyber-400">
                <Icon size={18} />
              </div>
              <h3 className="font-semibold text-white text-sm">{title}</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section>
        <h2 className="font-display text-2xl text-white mb-8">Technology Stack</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tech.map((t) => (
            <div key={t.label} className="flex gap-4 glass rounded-xl p-4">
              <div className="h-2 w-2 rounded-full bg-cyber-500 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">{t.label}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Scope ── */}
      <section className="glass rounded-2xl p-8">
        <h2 className="font-display text-xl text-white mb-4">Project Scope & Limitations</h2>
        <div className="grid gap-6 md:grid-cols-2 text-sm text-slate-300">
          <div>
            <p className="font-semibold text-cyber-100 mb-2">In Scope</p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>Simulated SSO with 3 enterprise IdPs</li>
              <li>JWT authentication with protected routes</li>
              <li>5-role RBAC system with granular permissions</li>
              <li>Zscaler-style conditional access policy engine</li>
              <li>Auth, access, and audit log modules</li>
              <li>Compliance report generation views</li>
              <li>Admin dashboard with real-time metrics</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-300 mb-2">Out of Scope</p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-500">
              <li>Production Zscaler API integration</li>
              <li>Live SAML/OIDC federation (simulated)</li>
              <li>Real device posture from endpoint agents</li>
              <li>Persistent database (uses in-memory store)</li>
              <li>Email notification delivery</li>
              <li>Multi-tenant support</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
