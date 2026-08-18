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
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { DashboardFilters } from "../components/dashboard/DashboardFilters";
import { OSList } from "../components/dashboard/OsList";
import { useAuth } from "../hooks/useAuth";

export function Dashboard() {
  const auth = useAuth();

  const [ordens, setOrdens] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [ordenar, setOrdenar] = useState("createdAt");
  const [direcao, setDirecao] = useState("desc");

  const [abaAtiva, setAbaAtiva] = useState(
    auth.user.role === "TECNICO" ? "minhas" : "ativas",
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
          filtro: abaAtiva,
        },
      });
      setOrdens(response.data);
    } catch (err) {
      console.error("Erro ao carregar OS", err);
    } finally {
      setLoading(false);
    }
  }, [busca, ordenar, direcao, abaAtiva]);

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

  return (
    <div className="flex h-screen bg-slate-50">
      <MenuLateral />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <DashboardHeader
          user={auth.user}
          onNovaOS={() => setIsModalOpen(true)}
        />

        <DashboardStats ordens={ordens} />

        <DashboardFilters
          user={auth.user}
          abaAtiva={abaAtiva}
          setAbaAtiva={setAbaAtiva}
          busca={busca}
          setBusca={setBusca}
        />

        <OSList
          ordens={ordens}
          abaAtiva={abaAtiva}
          ordenar={ordenar}
          onOrdenar={handleOrdenar}
          onDetalhes={(id) => navigate(`/os/${id}`)}
        />
      </main>

      <ModalNovaOS
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadOS}
      />
    </div>
  );
}
