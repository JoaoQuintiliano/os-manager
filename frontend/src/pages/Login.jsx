import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const auth = useAuth();

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await api.post("/auth/login", { email, senha });

      auth.login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setErro(err.response?.data?.error || "E-mail ou senha incorretos.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <LogIn className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Bem-vindo</h2>
          <p className="text-slate-500 mt-2">Gestão de Ordens de Serviço</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-center gap-3 animate-shake">
              <AlertCircle className="text-red-500" size={20} />
              <span className="text-red-700 text-sm font-medium">{erro}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">
              E-mail
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="email"
                placeholder="nome@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">
                Senha
              </label>
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {carregando ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>

        <footer className="mt-8 text-center text-slate-400 text-xs">
          &copy; 2026 Sistema de OS Profissional. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}
