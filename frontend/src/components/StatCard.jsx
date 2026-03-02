export function StatCard({ title, value, icon, color }) {
  return (
    <div
      className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-1 ${color?.replace("border", "bg") || "bg-slate-200"}`}
      ></div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      <div className="bg-slate-50 p-3 rounded-full">{icon}</div>
    </div>
  );
}