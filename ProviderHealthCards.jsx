const statusColor = (status) => {
  if (status === "CONNECTED") return "bg-green-500";
  if (status === "DEGRADED") return "bg-yellow-500";
  return "bg-slate-500";
};
const syncColor = (sync) => {
  if (sync === "SYNCED") return "text-green-400";
  if (sync === "PENDING") return "text-yellow-400";
  return "text-slate-400";
};

const ProviderHealthCards = ({ providers = [] }) => (
  <div className="grid gap-4 sm:grid-cols-3">
    {providers.map((p) => (
      <div key={p.name} className="glass rounded-xl p-4 flex items-center gap-4">
        <span className={`h-3 w-3 rounded-full shrink-0 ${statusColor(p.status)} shadow-lg`} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{p.name}</p>
          <p className="text-xs text-slate-400">{p.status}</p>
          <p className={`text-xs font-medium ${syncColor(p.syncStatus)}`}>{p.syncStatus}</p>
        </div>
      </div>
    ))}
  </div>
);

export default ProviderHealthCards;
