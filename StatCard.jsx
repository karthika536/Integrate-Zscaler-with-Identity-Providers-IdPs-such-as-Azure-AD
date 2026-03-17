const StatCard = ({ title, value, hint, trend, warn }) => (
  <div className="glass rounded-xl p-5 flex flex-col gap-1 hover:border-cyber-500/30 transition-colors">
    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
    <p className={`font-display text-2xl font-bold mt-1 ${warn ? "text-red-400" : "text-white"}`}>{value}</p>
    {hint && <p className="text-xs text-slate-500">{hint}</p>}
    {trend && <p className={`text-xs mt-1 font-medium ${warn ? "text-red-400" : "text-cyber-400"}`}>{trend}</p>}
  </div>
);

export default StatCard;
