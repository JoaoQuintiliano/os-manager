export function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
        active
          ? "bg-white text-blue-600 shadow-sm border border-slate-200"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}