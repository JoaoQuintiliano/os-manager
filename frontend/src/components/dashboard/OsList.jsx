import {
  ArrowUpDown,
  AlertTriangle,
  Calendar,
  FileText,
  Filter,
  TriangleAlert,
  User,
} from "lucide-react";

import { TagStatus } from "../TagStatus";

export function OSList({ ordens, abaAtiva, ordenar, onOrdenar, onDetalhes }) {
  const formatarData = (dataISO) => {
    if (!dataISO) return "-";

    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                OS | Data
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Cliente | Descrição
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">
                Status
              </th>

              <th
                className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition group w-32"
                onClick={() => onOrdenar("prioridade")}
              >
                <div className="flex items-center gap-1">
                  Prioridade
                  <ArrowUpDown
                    className={`w-3 h-3 transition ${
                      ordenar === "prioridade"
                        ? "opacity-100"
                        : "opacity-30 group-hover:opacity-70"
                    }`}
                  />
                </div>
              </th>

              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-24">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {ordens.length > 0 ? (
              ordens.map((os) => (
                <tr
                  key={os.id}
                  className={`group hover:bg-blue-50/30 transition relative ${
                    os.prioridade === "ALTA"
                      ? "border-l-4 border-l-red-500"
                      : "border-l-4 border-l-transparent"
                  }`}
                >
                  {/* OS / Data */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">#{os.id}</span>

                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {formatarData(os.createdAt)}
                      </span>
                    </div>
                  </td>

                  {/* Cliente / Descrição */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {os.cliente?.nome}
                      </span>

                      {abaAtiva !== "minhas" && (
                        <span className="text-[10px] text-blue-600 font-semibold uppercase mt-0.5 flex items-center gap-1">
                          {os.tecnico ? (
                            <>
                              <User size={12} />
                              {os.tecnico.nome}
                            </>
                          ) : (
                            <>
                              <TriangleAlert size={12} />
                              Sem Técnico
                            </>
                          )}
                        </span>
                      )}

                      <div
                        className="flex items-start gap-1 mt-1 text-slate-500"
                        title={os.descricao}
                      >
                        <FileText size={12} className="mt-0.5 shrink-0" />

                        <span className="text-xs block max-w-[200px] lg:max-w-[300px] truncate">
                          {os.descricao || "Sem descrição"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 align-top">
                    <TagStatus status={os.status} />
                  </td>

                  {/* Prioridade */}
                  <td className="px-6 py-4 align-top">
                    {os.prioridade === "ALTA" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                        <AlertTriangle size={12} />
                        ALTA
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded-md">
                        NORMAL
                      </span>
                    )}
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4 text-right align-top">
                    <button
                      onClick={() => onDetalhes(os.id)}
                      className="text-slate-400 hover:text-blue-600 font-medium text-sm transition-colors"
                    >
                      Detalhes &rarr;
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Filter size={40} className="mb-4 opacity-20" />

                    <p className="text-lg font-medium text-slate-600">
                      Nenhum resultado nesta aba
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
