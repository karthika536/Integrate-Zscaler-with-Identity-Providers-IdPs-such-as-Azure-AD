import { useState } from "react";
import { Bell, LogOut, Search, Shield, Menu, X, ChevronRight } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { toast } from "react-toastify";

const links = [
  { name: "Dashboard", path: "/app/dashboard", emoji: "📊" },
  { name: "Users", path: "/app/users", emoji: "👥" },
  { name: "Roles", path: "/app/roles", emoji: "🔑" },
  { name: "Identity Providers", path: "/app/providers", emoji: "🌐" },
  { name: "Zscaler Policies", path: "/app/policies", emoji: "🛡" },
  { name: "Access Logs", path: "/app/logs", emoji: "📋" },
  { name: "Reports", path: "/app/reports", emoji: "📄" },
  { name: "Settings", path: "/app/settings", emoji: "⚙️" },
  { name: "Profile", path: "/app/profile", emoji: "👤" },
  { name: "Help", path: "/app/help", emoji: "❓" },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Signed out successfully.");
    navigate("/");
  };

  const Sidebar = ({ mobile }) => (
    <aside className={`glass flex flex-col border-r border-slate-800 ${mobile ? "w-72" : "hidden lg:flex w-[250px]"} h-full`}>
      <div className="flex items-center justify-between p-5 mb-2">
        <div className="flex items-center gap-2 font-display text-lg text-white">
          <Shield className="text-cyber-500" size={18} />
          Admin Console
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* User badge */}
      <div className="mx-3 mb-4 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2.5">
        <p className="text-xs font-semibold text-white truncate">{user?.name || "User"}</p>
        <p className="text-xs text-cyber-400 mt-0.5">{user?.role || "N/A"}</p>
        <p className="text-xs text-slate-600 mt-0.5 truncate">{user?.email || ""}</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-cyber-700/30 text-cyber-100 border border-cyber-700/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-base leading-none">{link.emoji}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 mt-2 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar mobile={false} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 h-full">
            <Sidebar mobile={true} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="glass sticky top-0 z-30 border-b border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-slate-400 hover:text-white p-1"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-400 min-w-[220px]">
                <Search size={13} />
                <input
                  className="bg-transparent outline-none flex-1 text-sm placeholder-slate-500 text-slate-200"
                  placeholder="Search users, logs, policies…"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button className="relative rounded-lg border border-slate-700 p-2 text-slate-300 hover:text-white hover:border-slate-600 transition-colors">
                <Bell size={15} />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
              </button>
              <div className="hidden sm:block rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300">
                <span className="font-semibold text-white">{user?.name?.split(" ")[0] || "User"}</span>
                <span className="text-slate-500 ml-1">· {user?.role || "N/A"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-1.5 text-xs py-1.5"
              >
                <LogOut size={12} /> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900/80">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
