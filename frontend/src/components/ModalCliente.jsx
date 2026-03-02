import { useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";

export function ModalCliente({ onClose, onClienteCriado }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [rua, setRua] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  async function handleNovoCliente(e) {
    e.preventDefault();
    try {
      await api.post("/clientes", {
        nome,
        email,
        telefone,
        endereco: { rua, cidade, estado, cep },
      });

      onClienteCriado(); // atualiza lista no pai
      onClose(); 
      setNome("");
      setEmail("");
      setTelefone("");
      setRua("");
      setCidade("");
      setEstado("");
      setCep("");

      alert("Cliente cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar cliente.");
    }
  }
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Novo Cliente</h3>
          <button onClick={() => onClose(false)}>
            <X size={25} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleNovoCliente} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-600">
                Nome Completo
              </label>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">
                Telefone
              </label>
              <input
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">
                E-mail (Opcional)
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <hr className="border-slate-300" />

          <div>
            <label className="text-xs font-bold text-slate-600">
              Rua / Logradouro
            </label>
            <input
              required
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Av. Brasil, 123"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-xs font-bold text-slate-600">CEP</label>
              <input
                required
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-600">Cidade</label>
              <input
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600">
              Estado (UF)
            </label>
            <input
              required
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="SP"
              maxLength={2}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2"
          >
            Salvar Cadastro
          </button>
        </form>
      </div>
    </div>
  );
}
