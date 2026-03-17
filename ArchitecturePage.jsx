import { ChevronRight } from "lucide-react";

const flow = [
  { label: "User / Browser", color: "bg-slate-700 border-slate-600", text: "text-slate-200" },
  { label: "React Frontend (Vite)", color: "bg-cyber-900/60 border-cyber-700", text: "text-cyber-100" },
  { label: "JWT Auth Guard", color: "bg-indigo-900/60 border-indigo-700", text: "text-indigo-200" },
  { label: "Express REST API", color: "bg-cyber-900/60 border-cyber-700", text: "text-cyber-100" },
  { label: "RBAC Middleware", color: "bg-purple-900/60 border-purple-700", text: "text-purple-200" },
  { label: "Zscaler Policy Engine", color: "bg-orange-900/60 border-orange-700", text: "text-orange-200" },
  { label: "In-Memory Data Store", color: "bg-green-900/60 border-green-700", text: "text-green-200" },
  { label: "Audit / Log Capture", color: "bg-rose-900/60 border-rose-700", text: "text-rose-200" },
];

const layers = [
  {
    name: "Presentation Layer",
    tech: "React 18 + Vite + TailwindCSS",
    resp: "SPA routing, protected pages, form handling, data visualization",
    files: "App.jsx, PublicLayout.jsx, DashboardLayout.jsx, all *Page.jsx",
  },
  {
    name: "Authentication Layer",
    tech: "JWT (jsonwebtoken) + bcryptjs",
    resp: "Token generation, password hashing, session expiry, /auth/me endpoint",
    files: "authController.js, authMiddleware.js, jwt.js, AuthContext.jsx",
  },
  {
    name: "Authorization Layer",
    tech: "Custom RBAC + RoleGuard",
    resp: "Permission checks on API routes and UI components per user role",
    files: "rbacMiddleware.js, permissions.js, RoleGuard.jsx, ProtectedRoute.jsx",
  },
  {
    name: "API Layer",
    tech: "Express.js + morgan + helmet + cors",
    resp: "RESTful endpoints for users, roles, providers, policies, logs, reports, settings",
    files: "app.js, *Routes.js, *Controller.js",
  },
  {
    name: "Policy Engine",
    tech: "Custom in-memory policy evaluator",
    resp: "Evaluates MFA, device posture, role, department constraints for access decisions",
    files: "policyController.js, ZscalerPolicy.js, store.js (policies[])",
  },
  {
    name: "Data Layer",
    tech: "In-memory JS objects (store.js)",
    resp: "Stores users, roles, providers, policies, logs, reports, settings with CRUD helpers",
    files: "store.js, database.js, seed.js",
  },
];

const protocols = [
  { idp: "Azure AD", protocol: "OAuth2 / OpenID Connect", field: "tenantId + clientId + metadataUrl", status: "CONNECTED" },
  { idp: "Okta", protocol: "SAML 2.0", field: "domain + metadataUrl", status: "CONNECTED" },
  { idp: "Active Directory", protocol: "LDAP / Kerberos", field: "domain + ldap endpoint", status: "DEGRADED" },
];

const ArchitecturePage = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">

      {/* Header */}
      <section>
        <h1 className="font-display text-4xl text-white">System Architecture</h1>
        <p className="mt-4 text-slate-400 max-w-2xl text-lg">
          A layered Zero Trust architecture connecting identity providers through a centralised policy engine to applications.
        </p>
      </section>

      {/* Flow diagram */}
      <section>
        <h2 className="font-display text-xl text-white mb-6">Request Flow Diagram</h2>
        <div className="glass rounded-2xl p-8">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {flow.map((node, i) => (
              <div key={node.label} className="flex items-center gap-2">
                <div className={`rounded-xl border px-4 py-3 text-xs font-semibold text-center min-w-[120px] ${node.color} ${node.text}`}>
                  {node.label}
                </div>
                {i < flow.length - 1 && (
                  <ChevronRight size={16} className="text-slate-500 shrink-0" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            Every request traverses Auth Guard → RBAC Middleware → Policy Engine before reaching data.
          </p>
        </div>
      </section>

      {/* Layer breakdown */}
      <section>
        <h2 className="font-display text-xl text-white mb-6">Architecture Layer Breakdown</h2>
        <div className="space-y-3">
          {layers.map((layer, i) => (
            <div key={layer.name} className="glass rounded-xl p-5 grid md:grid-cols-[180px_1fr_1fr_1fr] gap-4 items-start">
              <div>
                <span className="text-xs text-cyber-400 font-medium">Layer {i + 1}</span>
                <p className="text-sm font-semibold text-white mt-0.5">{layer.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Technology</p>
                <p className="text-xs text-slate-300 font-mono">{layer.tech}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Responsibility</p>
                <p className="text-xs text-slate-400">{layer.resp}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Key Files</p>
                <p className="text-xs text-slate-400 font-mono">{layer.files}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IdP protocols */}
      <section>
        <h2 className="font-display text-xl text-white mb-6">Identity Provider Integration Protocols</h2>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 bg-slate-900/80 px-5 py-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
            <span>Provider</span><span>Protocol</span><span>Config Fields</span><span>Status</span>
          </div>
          {protocols.map((p) => (
            <div key={p.idp} className="grid grid-cols-4 border-t border-slate-800 px-5 py-4 text-sm hover:bg-slate-800/20">
              <span className="font-semibold text-white">{p.idp}</span>
              <span className="text-slate-300">{p.protocol}</span>
              <span className="text-xs text-slate-400 font-mono">{p.field}</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${p.status === "CONNECTED" ? "text-green-400" : "text-yellow-400"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${p.status === "CONNECTED" ? "bg-green-400" : "bg-yellow-400"}`} />
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Security model */}
      <section className="grid gap-5 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-white mb-3">Zero Trust Principles Applied</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            {[
              "Verify explicitly — every API request requires a valid JWT",
              "Use least privilege — RBAC scopes access to minimum required permissions",
              "Assume breach — all access attempts are logged and auditable",
              "Device posture — policies reject non-compliant endpoints",
              "MFA enforcement — configurable per organisation in settings",
              "Session expiry — automatic logout after 30-minute idle timeout",
            ].map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-cyber-500 mt-0.5">›</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg text-white mb-3">Data Flow for Access Decision</h3>
          <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
            {[
              "User submits credentials or triggers SSO",
              "Backend verifies password / IdP mapping",
              "JWT issued with userId + roleName payload",
              "Frontend stores token; subsequent calls send Bearer header",
              "authMiddleware.js validates token & fetches user",
              "rbacMiddleware.js checks user.role.permissions array",
              "Policy engine evaluates MFA, posture, department",
              "Access GRANTED or DENIED with log entry created",
            ].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </section>

    </div>
  );
};

export default ArchitecturePage;
