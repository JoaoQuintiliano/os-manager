import { useEffect, useState, useCallback } from "react";
import {
  ClipboardList,
  PlusCircle,
  Clock,
  LoaderCircle,
  Wrench,
  CheckCircle,
  Search,
  ArrowUpDown,
  AlertTriangle,
  Calendar,
  FileText,
  Filter,
  TriangleAlert,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ModalNovaOS } from "../components/Modal";
import { MenuLateral } from "../components/MenuLatarel";
import { StatCard } from "../components/StatCard";
import { TagStatus } from "../components/TagStatus";
import { TabButton } from "../components/TabButton";

export function Dashboard() {
  const user = JSON.parse(localStorage.getItem("@SistemaOS:user"));
  const [ordens, setOrdens] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [ordenar, setOrdenar] = useState("createdAt");
  const [direcao, setDirecao] = useState("desc");
  const [abaAtiva, setAbaAtiva] = useState(
    user?.role === "TECNICO" ? "minhas" : "ativas",
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadOS = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/os", {
        params: {
          busca: busca || undefined,
          ordenar,
          direcao,
        },
      });
      setOrdens(response.data);
    } catch (err) {
      console.error("Erro ao carregar OS", err);
    } finally {
      setLoading(false);
    }
  }, [busca, ordenar, direcao]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadOS();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [loadOS]);

  const handleOrdenar = (campo) => {
    if (ordenar === campo) {
      setDirecao(direcao === "asc" ? "desc" : "asc");
    } else {
      setOrdenar(campo);
      setDirecao("asc");
    }
  };

  const ordensFiltradas = ordens.filter((os) => {
    if (abaAtiva === "minhas") {
      return os.tecnicoId === user?.id;
    }

    if (abaAtiva === "ativas") {
      return os.status !== "FINALIZADA" && os.status !== "CANCELADA";
    }
    if (abaAtiva === "finalizadas") {
      return os.status === "FINALIZADA" || os.status === "CANCELADA";
    }
    return true;
  });

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
    <div className="flex h-screen bg-slate-50">
      <MenuLateral />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Painel de Controle
            </h1>
            <p className="text-slate-500">Bem-vindo, {user?.nome}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition active:scale-95"
          >
            <PlusCircle size={20} /> Nova OS
          </button>
        </header>

        {/* Cards de Estatisticas */}
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
            title="Finalizadas Hoje"
            value={ordens.filter((o) => o.status === "FINALIZADA").length}
            icon={<CheckCircle className="text-emerald-500" />}
            color="border-emerald-500"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200 w-full md:w-auto overflow-x-auto">
            {/* Aba Minhas - p/ tec e adm */}
            {(user?.role === "TECNICO" || user?.role === "ADMIN") && (
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

        {/* Lista de OS*/}
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
                    onClick={() => handleOrdenar("prioridade")}
                  >
                    <div className="flex items-center gap-1">
                      Prioridade
                      <ArrowUpDown
                        className={`w-3 h-3 transition ${ordenar === "prioridade" ? "opacity-100" : "opacity-30 group-hover:opacity-70"}`}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-24">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ordensFiltradas.length > 0 ? (
                  ordensFiltradas.map((os) => (
                    <tr
                      key={os.id}
                      className={`group hover:bg-blue-50/30 transition relative
                        ${os.prioridade === "ALTA" ? "border-l-4 border-l-red-500" : "border-l-4 border-l-transparent"}
                      `}
                    >
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">
                            #{os.id}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Calendar size={12} />
                            {formatarData(os.createdAt)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {os.cliente?.nome}
                          </span>

                          {abaAtiva !== "minhas" && (
                            <span className="text-[10px] text-blue-600 font-semibold uppercase mt-0.5 flex items-center gap-1 ">
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

                      <td className="px-6 py-4 align-top">
                        <TagStatus status={os.status} />
                      </td>

                      <td className="px-6 py-4 align-top">
                        {os.prioridade === "ALTA" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                            <AlertTriangle size={12} /> ALTA
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded-md">
                            NORMAL
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right align-top">
                        <button
                          onClick={() => navigate(`/os/${os.id}`)}
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
      </main>

      <ModalNovaOS
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadOS()}
      />
    </div>
  );
}
