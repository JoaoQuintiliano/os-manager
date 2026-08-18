import { Clock, LoaderCircle, Wrench, CheckCircle } from "lucide-react";

import { StatCard } from "../StatCard";

export function DashboardStats({ ordens }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Pendentes"
        value={ordens.filter((o) => o.status === "ABERTA").length}
        icon={<Clock className="text-amber-500" />}
        color="border-amber-500"
      />

      <StatCard
        title="Em Andamento"
        value={ordens.filter((o) => o.status === "EM_ANDAMENTO").length}
        icon={<LoaderCircle className="text-blue-500" />}
        color="border-blue-500"
      />

      <StatCard
        title="Aguardando Peça"
        value={ordens.filter((o) => o.status === "AGUARDANDO_PECA").length}
        icon={<Wrench className="text-purple-500" />}
        color="border-purple-500"
      />

      <StatCard
        title="Finalizadas"
        value={ordens.filter((o) => o.status === "FINALIZADA").length}
        icon={<CheckCircle className="text-emerald-500" />}
        color="border-emerald-500"
      />
    </div>
  );
}
