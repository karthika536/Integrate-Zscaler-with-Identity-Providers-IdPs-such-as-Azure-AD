const LoadingSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3 animate-pulse">
    <div className="h-8 w-48 rounded-lg bg-slate-800/70" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-slate-800/50" />
      ))}
    </div>
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="h-10 bg-slate-900/80" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-t border-slate-800 px-4 py-3 flex gap-4">
          <div className="h-4 flex-1 rounded bg-slate-800/60" />
          <div className="h-4 w-24 rounded bg-slate-800/60" />
          <div className="h-4 w-16 rounded bg-slate-800/60" />
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
