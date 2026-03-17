import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#2a84ff", "#06b6d4", "#f59e0b", "#10b981"];

const DashboardCharts = ({ accessTrend = [], providerStats = [] }) => {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Access Trend */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-base text-white mb-4">Access Trend (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={accessTrend} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="_id" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            <Bar dataKey="granted" name="Granted" fill="#2a84ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="denied" name="Denied" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Provider distribution */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-base text-white mb-4">Auth Events by Provider</h3>
        {providerStats.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">No data available</div>
        ) : (
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie data={providerStats} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {providerStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }}
                  formatter={(val, name) => [val, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {providerStats.map((p, i) => (
                <div key={p._id} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-300 truncate">{p._id}</span>
                  <span className="ml-auto text-xs font-semibold text-white">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;
