import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Wrench,
  Clock,
  Save,
  UserPlus,
  HardHat,
} from "lucide-react";
import api from "../services/api";

export function OSDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [os, setOs] = useState(null);
  const [loading, setLoading] = useState(true);

  // att andamento
  const [novoStatus, setNovoStatus] = useState("");
  const [observacao, setObservacao] = useState("");

  // att tecn
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoIdSelecionado, setTecnicoIdSelecionado] = useState("");

  const user = JSON.parse(localStorage.getItem("@SistemaOS:user"));
  const isRecepcao = user?.role === "USER";
  const isTecnico = user?.role === "TECNICO";
  const isAdmin = user?.role === "ADMIN";

  async function loadOS() {
    try {
      const response = await api.get(`/os/${id}`);
      setOs(response.data);
      setNovoStatus(response.data.status);
    } catch (error) {
      alert("Erro ao carregar OS");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function loadTecnicos() {
    try {
      const response = await api.get("/usuarios/");
      const apenasTecnicos = response.data.filter((u) => u.role === "TECNICO");
      setTecnicos(apenasTecnicos);
    } catch (error) {
      console.error("Erro ao carregar técnicos", error);
    }
  }

  useEffect(() => {
    loadOS();
    // Só carrega a lista de tec se o user logado tiver permissão
    if (isRecepcao || isAdmin) {
      loadTecnicos();
    }
  }, [id]);

  async function handleUpdateStatus() {
    try {
      await api.patch(`/os/${id}/status`, { novoStatus, observacao });
      setObservacao("");
      loadOS(); // recarregar para novo historico
      alert("Status atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar status.");
    }
  }

  async function handleAtribuirTecnico() {
    if (!tecnicoIdSelecionado) {
      return alert("Por favor, selecione um técnico na lista.");
    }

    try {
      await api.patch(`/os/${id}/tecnico`, {
        tecnicoId: Number(tecnicoIdSelecionado),
      });
      setTecnicoIdSelecionado("");
      loadOS(); // recarregar para mostrar novo tec e novo historico
      alert("Técnico atribuído com sucesso!");
    } catch (error) {
      alert("Erro ao atribuir técnico.");
    }
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando...
      </div>
    );
  if (!os) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 bg-white border rounded-lg hover:bg-slate-100 transition"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Ordem de Serviço #{os.id}
          </h1>
          <p className="text-slate-500 text-sm">
            Criado em {new Date(os.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Dados da OS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">
              Dados do Chamado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Cliente
                </label>
                <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                  <User size={18} className="text-blue-500" />{" "}
                  {os.cliente?.nome}
                </div>
                <p className="text-sm text-slate-500 ml-6">
                  {os.cliente?.email}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Prioridade
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${os.prioridade === "ALTA" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                  >
                    {os.prioridade}
                  </span>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Calendar size={14} />{" "}
                    {new Date(os.prazoSLA).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Técnico Responsável
                </label>
                <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium">
                  <HardHat
                    size={18}
                    className={os.tecnico ? "text-amber-500" : "text-slate-300"}
                  />
                  {os.tecnico ? (
                    os.tecnico.nome
                  ) : (
                    <span className="text-slate-400 italic">Aguardando...</span>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-bold text-slate-400 uppercase">
                  Descrição do Problema
                </label>
                <p className="mt-2 text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {os.descricao}
                </p>
              </div>
            </div>
          </div>

          {/* Att Andamento -> Apenas adm e tec */}
          {(isTecnico || isAdmin) && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                <Wrench size={20} className="text-slate-500" /> Atualizar
                Andamento
              </h2>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    className="p-2 border rounded-lg md:col-span-1 bg-slate-50 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    value={novoStatus}
                    onChange={(e) => setNovoStatus(e.target.value)}
                  >
                    <option value="ABERTA">ABERTA</option>
                    <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                    <option value="AGUARDANDO_PECA">AGUARDANDO PEÇA</option>
                    <option value="FINALIZADA">FINALIZADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Observação (ex: Peça chegou, testando...)"
                    className="p-2 border rounded-lg md:col-span-2 outline-none focus:ring-2 focus:ring-blue-500"
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleUpdateStatus}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Save size={18} /> Salvar Atualização
                </button>
              </div>
            </div>
          )}

          {/* Add Tec -> adm e user */}
          {(isRecepcao || isAdmin) && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                <UserPlus size={20} className="text-slate-500" /> Atribuir
                Técnico
              </h2>

              <div className="flex flex-col md:flex-row gap-4">
                <select
                  className="p-2 border border-slate-300 rounded-lg flex-1 outline-none focus:ring-2 focus:ring-green-500 bg-slate-50"
                  value={tecnicoIdSelecionado}
                  onChange={(e) => setTecnicoIdSelecionado(e.target.value)}
                >
                  <option value="">
                    Selecione um técnico para o serviço...
                  </option>
                  {tecnicos.map((tec) => (
                    <option key={tec.id} value={tec.id}>
                      {tec.nome}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAtribuirTecnico}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  Confirmar Atribuição
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Histórico */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="font-bold text-lg mb-6 text-slate-800 flex items-center gap-2">
            <Clock size={20} className="text-slate-500" /> Histórico
          </h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {os.historicos?.map((hist) => (
              <div
                key={hist.id}
                className="relative flex items-start group pl-8"
              >
                <div className="absolute left-0 top-1 h-5 w-5 rounded-full border-2 border-slate-300 bg-white group-hover:border-blue-500 group-hover:bg-blue-50 transition" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-mono mb-1">
                    {new Date(hist.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {hist.acao}
                  </p>
                  <p className="text-sm text-slate-500 italic mt-1">
                    "{hist.observacao}"
                  </p>
                  <p className="text-xs text-blue-500 mt-1 font-medium">
                    Por: {hist.usuario?.nome || "Sistema"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
