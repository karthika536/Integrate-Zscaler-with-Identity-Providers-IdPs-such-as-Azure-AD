import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "./authService.js";
import { Shield, Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await registerUser({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const err = (field) => errors[field] && <p className="mt-1 text-xs text-red-400">{errors[field]}</p>;

  return (
    <section className="mx-auto flex min-h-[85vh] max-w-md items-center px-6 py-10">
      <div className="glass w-full rounded-2xl p-8 shadow-panel">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="text-cyber-500" size={22} />
          <span className="font-display text-lg text-white">Zscaler IdP Fusion</span>
        </div>
        <h2 className="font-display text-2xl text-white">Create account</h2>
        <p className="mt-1.5 text-sm text-slate-400">Register with local credentials to access the platform.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">First Name</label>
              <input className={`input ${errors.firstName ? "border-red-500" : ""}`} placeholder="First" value={form.firstName} onChange={set("firstName")} />
              {err("firstName")}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Last Name</label>
              <input className={`input ${errors.lastName ? "border-red-500" : ""}`} placeholder="Last" value={form.lastName} onChange={set("lastName")} />
              {err("lastName")}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Email</label>
            <input className={`input ${errors.email ? "border-red-500" : ""}`} type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} />
            {err("email")}
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <input className={`input pr-10 ${errors.password ? "border-red-500" : ""}`} type={showPass ? "text" : "password"} placeholder="Min 8 characters" value={form.password} onChange={set("password")} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {err("password")}
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Confirm Password</label>
            <input className={`input ${errors.confirmPassword ? "border-red-500" : ""}`} type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set("confirmPassword")} />
            {err("confirmPassword")}
          </div>
          <button className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
            {loading ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Creating...</> : "Create Account"}
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-500">
          Already have an account? <Link to="/login" className="text-cyber-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
