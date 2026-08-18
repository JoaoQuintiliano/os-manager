import { Search } from "lucide-react";
import { TabButton } from "../TabButton";

export function DashboardFilters({
  abaAtiva,
  setAbaAtiva,
  user,
  busca,
  setBusca,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200 w-full md:w-auto overflow-x-auto">
        {(user.role === "TECNICO" || user.role === "ADMIN") && (
          <TabButton
            active={abaAtiva === "minhas"}
            onClick={() => setAbaAtiva("minhas")}
            label="Minhas OS"
          />
        )}

        <TabButton
          active={abaAtiva === "ativas"}
          onClick={() => setAbaAtiva("ativas")}
          label="Ativas"
        />

        <TabButton
          active={abaAtiva === "finalizadas"}
          onClick={() => setAbaAtiva("finalizadas")}
          label="Finalizadas"
        />

        <TabButton
          active={abaAtiva === "todas"}
          onClick={() => setAbaAtiva("todas")}
          label="Todas"
        />
      </div>

      <div className="bg-white p-2.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-3 w-full md:w-96">
        <Search className="text-slate-400" size={20} />

        <input
          type="text"
          placeholder="Buscar por cliente, ID..."
          className="flex-1 outline-none text-slate-700 text-sm"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
    </div>
  );
}
