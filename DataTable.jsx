const DataTable = ({ columns = [], data = [], emptyMessage = "No records found." }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/60">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-900/80 text-slate-400">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row._id || idx}
                className="border-t border-slate-800 bg-slate-900/20 hover:bg-slate-800/30 transition-colors"
              >
                {columns.map((col) => (
                  <td key={`${col.key}-${idx}`} className="px-4 py-3 text-slate-200 max-w-[280px]">
                    {typeof col.render === "function" ? col.render(row) : (row[col.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
