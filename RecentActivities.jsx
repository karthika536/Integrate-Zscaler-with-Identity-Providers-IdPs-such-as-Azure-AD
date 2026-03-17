const severityColor = (s) => {
  if (s === "HIGH") return "text-red-400 bg-red-500/10 border-red-500/30";
  if (s === "MEDIUM") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
  return "text-green-400 bg-green-500/10 border-green-500/30";
};

const RecentActivities = ({ logs = [] }) => {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-display text-base text-white mb-4">Recent Audit Activity</h3>
      {logs.length === 0 ? (
        <p className="text-sm text-slate-500 py-4 text-center">No recent audit events.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log, i) => (
            <div key={log._id || i} className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
              <span className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold shrink-0 ${severityColor(log.severity)}`}>
                {log.severity || "INFO"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 font-medium truncate">{log.action}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {log.actor ? `${log.actor.firstName} ${log.actor.lastName}` : log.actorId} · {log.entityType}
                </p>
              </div>
              <p className="text-xs text-slate-600 whitespace-nowrap shrink-0">
                {new Date(log.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
