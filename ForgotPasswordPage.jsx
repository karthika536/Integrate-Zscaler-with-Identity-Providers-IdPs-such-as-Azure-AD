import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "./authService.js";
import { Shield, Mail, CheckCircle } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email address."); return; }
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
      toast.success("Reset link simulated and sent.");
    } catch {
      toast.error("Something went wrong. Please try again.");
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

        {sent ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <h2 className="font-display text-xl text-white">Check your email</h2>
            <p className="mt-2 text-sm text-slate-400">
              A simulated password reset link has been sent to <span className="text-white">{email}</span>.
              In this demo, use the reset password page directly.
            </p>
            <Link to="/reset-password" state={{ email }} className="btn-primary mt-5 inline-block text-sm">
              Go to Reset Password
            </Link>
            <div className="mt-4">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-300">← Back to login</Link>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl text-white">Forgot password</h2>
            <p className="mt-1.5 text-sm text-slate-400">Enter your registered email to receive a reset link.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="input pl-9"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>
              <button className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
                {loading ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending...</> : "Send Reset Link"}
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

export default ForgotPasswordPage;
