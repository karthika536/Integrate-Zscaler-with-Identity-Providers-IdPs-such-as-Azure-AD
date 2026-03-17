import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "./api.js";
import { useAuth } from "./AuthContext.jsx";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", provider: "", role: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    api.get("/auth/me").then((r) => {
      const u = r.data.data;
      setProfile({ firstName: u.name?.split(" ")[0] || "", lastName: u.name?.split(" ")[1] || "", email: u.email, provider: u.provider, role: u.role });
    }).catch(() => {
      if (user) setProfile({ firstName: user.name?.split(" ")[0] || "", lastName: user.name?.split(" ")[1] || "", email: user.email, provider: user.provider, role: user.role });
    });
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put("/settings/profile", { firstName: profile.firstName, lastName: profile.lastName });
      toast.success("Profile updated successfully");
      if (setUser) setUser((prev) => ({ ...prev, name: `${profile.firstName} ${profile.lastName}` }));
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error("Passwords do not match"); return; }
    setSavingPass(true);
    try {
      await api.put("/settings/change-password", { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password change failed");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="section-title">My Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your personal information and account security</p>
      </div>

      {/* Profile info */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-full bg-cyber-700/30 border border-cyber-500/30 flex items-center justify-center">
            <User size={24} className="text-cyber-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-lg">{profile.firstName} {profile.lastName}</p>
            <p className="text-sm text-slate-400">{profile.email}</p>
            <div className="flex gap-2 mt-1">
              <span className="inline-flex rounded-full border border-cyber-700/40 bg-cyber-500/10 px-2 py-0.5 text-xs text-cyber-300">{profile.role}</span>
              <span className="inline-flex rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{profile.provider}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <h3 className="font-display text-base text-white flex items-center gap-2"><User size={15} className="text-cyber-400" /> Personal Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">First Name</label>
              <input className="input" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} placeholder="First" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Last Name</label>
              <input className="input" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} placeholder="Last" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Email (read-only)</label>
            <input className="input opacity-60 cursor-not-allowed" disabled value={profile.email} />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60" disabled={savingProfile}>
            {savingProfile ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</> : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="glass rounded-2xl p-6">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <h3 className="font-display text-base text-white flex items-center gap-2"><Lock size={15} className="text-cyber-400" /> Change Password</h3>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Current Password</label>
            <div className="relative">
              <input className="input pr-10" type={showCurrent ? "text" : "password"} value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} placeholder="Current password" required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200" onClick={() => setShowCurrent(!showCurrent)}>{showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">New Password</label>
            <div className="relative">
              <input className="input pr-10" type={showNew ? "text" : "password"} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="Min 8 characters" required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200" onClick={() => setShowNew(!showNew)}>{showNew ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Confirm New Password</label>
            <input className="input" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} placeholder="Repeat new password" required />
          </div>
          <button type="submit" className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-60" disabled={savingPass}>
            {savingPass ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Updating...</> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
