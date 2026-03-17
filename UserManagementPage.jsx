import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "./api.js";
import DataTable from "./DataTable.jsx";
import { Plus, X, Search, UserCheck } from "lucide-react";

const ROLES = ["SUPER_ADMIN", "SECURITY_ADMIN", "IT_ADMIN", "EMPLOYEE", "AUDITOR"];
const PROVIDERS = ["LOCAL", "AZURE_AD", "OKTA", "ACTIVE_DIRECTORY"];

const EMPTY = { firstName: "", lastName: "", email: "", password: "", roleName: "EMPLOYEE", provider: "LOCAL" };

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchUsers = () =>
    api.get("/users").then((r) => setUsers(r.data.data)).catch(() => setUsers([]));

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() =>
    users.filter((u) => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(query.toLowerCase())),
    [users, query]
  );

  const openCreate = () => { setEditUser(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (u) => {
    setEditUser(u);
    setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: "", roleName: u.role?.name || "EMPLOYEE", provider: u.provider || "LOCAL" });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editUser) {
        await api.put(`/users/${editUser._id}`, { firstName: form.firstName, lastName: form.lastName, roleName: form.roleName, provider: form.provider });
        toast.success("User updated successfully");
      } else {
        await api.post("/users", form);
        toast.success("User created successfully");
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const statusBadge = (s) => (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${s === "ACTIVE" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{s}</span>
  );

  const columns = [
    { key: "name", label: "Name", render: (u) => `${u.firstName} ${u.lastName}` },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (u) => <span className="text-cyber-300 font-medium">{u.role?.name || "N/A"}</span> },
    { key: "provider", label: "Provider" },
    { key: "mfa", label: "MFA", render: (u) => <span className={u.mfaEnabled ? "text-green-400" : "text-slate-500"}>{u.mfaEnabled ? "Enabled" : "Off"}</span> },
    { key: "status", label: "Status", render: (u) => statusBadge(u.status) },
    { key: "lastLoginAt", label: "Last Login", render: (u) => u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never" },
    {
      key: "actions", label: "Actions", render: (u) => (
        <div className="flex gap-2">
          <button className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:text-white hover:border-cyber-500 transition-colors" onClick={() => openEdit(u)}>Edit</button>
          <button className="rounded-md border border-red-800 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50" disabled={deleting === u._id} onClick={() => handleDelete(u._id)}>
            {deleting === u._id ? "..." : "Delete"}
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title">User Management</h1>
          <p className="text-sm text-slate-400 mt-1">{users.length} provisioned identities</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm" onClick={openCreate}>
          <Plus size={14} /> Create User
        </button>
      </div>

      <div className="glass rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 text-sm" placeholder="Search by name or email…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <span className="text-xs text-slate-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <DataTable columns={columns} data={filtered} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="glass w-full max-w-lg rounded-2xl p-7 shadow-panel">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-white flex items-center gap-2">
                <UserCheck size={18} className="text-cyber-400" />
                {editUser ? "Edit User" : "Create New User"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">First Name</label>
                  <input className="input" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Last Name</label>
                  <input className="input" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                <input className="input" type="email" required disabled={!!editUser} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@company.com" />
              </div>
              {!editUser && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Password</label>
                  <input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Role</label>
                  <select className="input" value={form.roleName} onChange={(e) => setForm({ ...form, roleName: e.target.value })}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Provider</label>
                  <select className="input" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}>
                    {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60" disabled={saving}>
                  {saving ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</> : (editUser ? "Update User" : "Create User")}
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

export default UserManagementPage;
