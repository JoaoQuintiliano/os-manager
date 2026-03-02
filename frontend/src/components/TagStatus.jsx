export function TagStatus({ status }) {
  const styles = {
    ABERTA: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
    EM_ANDAMENTO: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
    AGUARDANDO_PECA:
      "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20",
    FINALIZADA:
      "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
    CANCELADA: "bg-slate-50 text-slate-600 border-slate-200 ring-slate-500/20",
  };

  const labels = {
    ABERTA: "Aberta",
    EM_ANDAMENTO: "Em Andamento",
    AGUARDANDO_PECA: "Aguardando Peça",
    FINALIZADA: "Finalizada",
    CANCELADA: "Cancelada",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold border ring-1 ${
        styles[status] || styles.CANCELADA
      } flex w-fit items-center gap-1.5 whitespace-nowrap`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "FINALIZADA" ? "bg-emerald-500" : "bg-current"}`}
      ></span>
      {labels[status] || status}
    </span>
  );
}