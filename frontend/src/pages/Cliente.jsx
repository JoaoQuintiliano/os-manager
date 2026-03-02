import { useState, useEffect } from "react";
import { Plus, Search, User, Phone, MapPin } from "lucide-react";
import api from "../services/api";
import { MenuLateral } from "../components/MenuLatarel";
import { ModalCliente } from "../components/ModalCliente";

export function Cliente() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
    } catch (error) {
      alert("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <MenuLateral />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
              <p className="text-slate-500">Gerencie sua base de clientes</p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-sm"
            >
              <Plus size={20} /> Novo Cliente
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
            <Search className="text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome..."
              className="flex-1 outline-none text-slate-700"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clientesFiltrados.map((cliente) => (
                <div
                  key={cliente.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">
                        {cliente.nome}
                      </h3>
                      <p className="text-xs text-slate-500">{cliente.email}</p>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 space-y-1">
                    <p className="flex items-center gap-2">
                      <Phone size={14} /> {cliente.telefone}
                    </p>
                    {cliente.enderecos && cliente.enderecos[0] && (
                      <p className="flex items-center gap-2 truncate">
                        <MapPin size={14} /> {cliente.enderecos[0].rua},{" "}
                        {cliente.enderecos[0].cidade}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <ModalCliente
          onClose={() => setModalOpen(false)}
          onClienteCriado={carregarClientes}
        />
      )}
    </div>
  );
}
