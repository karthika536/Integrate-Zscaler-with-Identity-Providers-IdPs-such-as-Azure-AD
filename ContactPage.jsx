import { useState } from "react";
import { toast } from "react-toastify";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", org: "", email: "", type: "demo", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you shortly.");
  };

  const Field = ({ name, label, type = "text", as = "input", children }) => (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      {as === "textarea" ? (
        <textarea
          className={`input min-h-[110px] resize-none ${errors[name] ? "border-red-500" : ""}`}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        />
      ) : as === "select" ? (
        <select
          className={`input ${errors[name] ? "border-red-500" : ""}`}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        >
          {children}
        </select>
      ) : (
        <input
          className={`input ${errors[name] ? "border-red-500" : ""}`}
          type={type}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          placeholder={label}
        />
      )}
      {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Contact & Demo Request</h1>
      <p className="mt-3 text-slate-400 max-w-xl">
        Send a message for a guided demo walkthrough, feedback on the project, or academic collaboration enquiries.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">

        {/* Form */}
        {submitted ? (
          <div className="glass rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4">
            <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={28} className="text-green-400" />
            </div>
            <h2 className="font-display text-xl text-white">Message Received!</h2>
            <p className="text-slate-400 text-sm max-w-xs">
              Thanks for reaching out. We'll review your request and respond within 24 hours.
            </p>
            <button className="btn-secondary mt-2 text-sm" onClick={() => { setSubmitted(false); setForm({ name: "", org: "", email: "", type: "demo", message: "" }); }}>
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Full Name" />
              <Field name="org" label="Organisation / College" />
            </div>
            <Field name="email" label="Email Address" type="email" />
            <Field name="type" label="Request Type" as="select">
              <option value="demo">Guided Demo Walkthrough</option>
              <option value="collab">Academic Collaboration</option>
              <option value="feedback">Project Feedback</option>
              <option value="other">Other</option>
            </Field>
            <Field name="message" label="Message" as="textarea" />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending...</>
              ) : (
                <><Send size={14} /> Submit Request</>
              )}
            </button>
          </form>
        )}

        {/* Info sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display text-base text-white mb-4">Contact Details</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-cyber-400 shrink-0" />
                <span>demo@nimbus-enterprise.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={15} className="text-cyber-400 shrink-0" />
                <span>Department of CSE, Engineering College</span>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display text-base text-white mb-3">Quick Demo Login</h3>
            <p className="text-xs text-slate-400 mb-3">Use these to explore the platform immediately:</p>
            {[
              { role: "Super Admin", email: "superadmin@nimbus.com" },
              { role: "Employee", email: "employee@nimbus.com" },
              { role: "Auditor", email: "auditor@nimbus.com" },
            ].map((u) => (
              <div key={u.email} className="mb-2 rounded-lg border border-slate-700 px-3 py-2">
                <p className="text-xs font-semibold text-white">{u.role}</p>
                <p className="text-xs text-slate-500 font-mono">{u.email}</p>
              </div>
            ))}
            <p className="text-xs text-slate-600 mt-2">Password: <span className="text-slate-400">Password@123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
