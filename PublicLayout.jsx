import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Shield, Lock, Globe, Mail, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Features", path: "/features" },
  { name: "Architecture", path: "/architecture" },
  { name: "Help", path: "/help" },
  { name: "Contact", path: "/contact" },
];

const PublicLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-white">
            <Shield className="text-cyber-500" size={20} />
            Zscaler IdP Fusion
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `text-sm transition font-medium ${isActive ? "text-cyber-400" : "text-slate-300 hover:text-white"}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-primary text-xs hidden sm:inline-flex">
              Launch Demo
            </Link>
            {/* Mobile toggle */}
            <button
              className="md:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm transition ${isActive ? "bg-cyber-700/30 text-cyber-100" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <Link to="/login" className="btn-primary w-full text-center mt-2 block text-sm" onClick={() => setMobileOpen(false)}>
              Launch Demo
            </Link>
          </div>
        )}
      </header>

      {/* Page */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70 mt-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display text-white mb-2">
              <Shield className="text-cyber-500" size={16} />
              Zscaler IdP Fusion
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Final year B.Tech project demonstrating Zero Trust access governance via Zscaler and multi-IdP federation.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">Platform Capabilities</p>
            <p className="flex items-center gap-2 text-sm text-slate-400"><Globe size={13} className="text-cyber-500" /> Multi-IdP Federation (Azure AD, Okta, AD)</p>
            <p className="flex items-center gap-2 text-sm text-slate-400"><Lock size={13} className="text-cyber-500" /> Conditional Access Policy Engine</p>
            <p className="flex items-center gap-2 text-sm text-slate-400"><Shield size={13} className="text-cyber-500" /> Audit Trail & Compliance Reports</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">Contact</p>
            <p className="text-sm text-slate-400 mb-2">Request a guided walkthrough or send project feedback</p>
            <p className="flex items-center gap-2 text-sm text-slate-400"><Mail size={13} className="text-cyber-500" /> demo@nimbus-enterprise.com</p>
            <div className="mt-4 flex gap-2">
              <Link to="/login" className="btn-primary text-xs">Try Demo</Link>
              <Link to="/contact" className="btn-secondary text-xs">Contact Us</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-600">
          © 2026 Zscaler IdP Fusion · Final Year Project · Built with React + Express
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
