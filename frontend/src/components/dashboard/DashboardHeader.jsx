import { PlusCircle } from "lucide-react";

export function DashboardHeader({ user, onNovaOS }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Painel de Controle
        </h1>

        <p className="text-slate-500">Bem-vindo, {user.nome}</p>
      </div>

      <button
        onClick={onNovaOS}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition active:scale-95"
      >
        <PlusCircle size={20} />
        Nova OS
      </button>
    </header>
  );
}
