import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "./authService.js";
import { Shield, Eye, EyeOff, CheckCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    if (newPassword.length < 8) e.newPassword = "Min 8 characters";
    if (newPassword !== confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await resetPassword({ email, newPassword });
      setDone(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed. Check the email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[85vh] max-w-md items-center px-6 py-10">
      <div className="glass w-full rounded-2xl p-8 shadow-panel">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="text-cyber-500" size={22} />
          <span className="font-display text-lg text-white">Zscaler IdP Fusion</span>
        </div>

        {done ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <h2 className="font-display text-xl text-white">Password Updated</h2>
            <p className="mt-2 text-sm text-slate-400">Your password has been reset. You can now sign in.</p>
            <button className="btn-primary mt-5 text-sm" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl text-white">Reset Password</h2>
            <p className="mt-1.5 text-sm text-slate-400">Enter your email and choose a new password.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                <input className={`input ${errors.email ? "border-red-500" : ""}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">New Password</label>
                <div className="relative">
                  <input className={`input pr-10 ${errors.newPassword ? "border-red-500" : ""}`} type={showPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.newPassword && <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>}
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Confirm Password</label>
                <input className={`input ${errors.confirmPassword ? "border-red-500" : ""}`} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
              </div>
              <button className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
                {loading ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Resetting...</> : "Reset Password"}
              </button>
            </form>
            <div className="mt-5 text-center">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-300">← Back to login</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ResetPasswordPage;
