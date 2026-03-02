import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import Select from "react-select";
import api from "../services/api";

export function ModalNovaOS({ isOpen, onClose, onSuccess }) {
  const [clientesOptions, setClientesOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    prioridade: "NORMAL",
    prazoSLA: "",
  });
  const dataHoje = new Date().toISOString().split("T")[0];
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  useEffect(() => {
    if (isOpen) {
      async function loadClientes() {
        try {
          const response = await api.get("/clientes");
          const options = response.data.map((cliente) => ({
            value: cliente.id,
            label: `${cliente.nome} ${cliente.telefone ? `(${cliente.telefone})` : ""}`,
          }));
          setClientesOptions(options);
        } catch (error) {
          console.error("Erro ao buscar clientes", error);
        }
      }
      loadClientes();
    }
  }, [isOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!clienteSelecionado) {
      alert("Por favor, selecione um cliente.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/os", {
        ...formData,
        clienteId: Number(clienteSelecionado.value),
      });

      onSuccess();
      onClose();

      setFormData({
        descricao: "",
        prioridade: "NORMAL",
        prazoSLA: "",
      });
      setClienteSelecionado(null);
    } catch (error) {
      alert(
        "Erro ao criar Ordem de Serviço. Verifique os dados e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  const customStyles = {
    //Styles para o react-select
    control: (provided, state) => ({
      ...provided,
      padding: "2px",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "white" : "#334155",
      cursor: "pointer",
    }),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center ">
          <h3 className="font-bold text-lg text-slate-800">
            Nova Ordem de Serviço
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition"
          >
            <X size={25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Buscar Cliente
            </label>
            <Select
              options={clientesOptions}
              value={clienteSelecionado}
              onChange={(opcao) => setClienteSelecionado(opcao)}
              placeholder="Digite o nome do cliente..."
              isSearchable={true}
              noOptionsMessage={() => "Nenhum cliente encontrado"}
              styles={customStyles}
              className="text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descrição do Problema
            </label>
            <textarea
              required
              rows="3"
              minLength={10}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
              placeholder="Ex: Equipamento não liga, cheiro de queimado..."
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prioridade
              </label>
              <select
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500"
                value={formData.prioridade}
                onChange={(e) =>
                  setFormData({ ...formData, prioridade: e.target.value })
                }
              >
                <option value="NORMAL">Normal</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prazo Limite
              </label>
              <input
                type="date"
                required
                min={dataHoje}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500"
                value={formData.prazoSLA}
                onChange={(e) =>
                  setFormData({ ...formData, prazoSLA: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !clienteSelecionado}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              Salvar OS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
