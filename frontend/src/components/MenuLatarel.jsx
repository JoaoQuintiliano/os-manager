import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function MenuLateral() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();

  function handleLogout() {
    auth.logout();
    navigate("/");
  }

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "flex items-center gap-3 p-3 rounded-lg bg-blue-600/10 text-blue-400 font-medium transition"
      : "flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-300 transition";
  };

  return (
    <>
      {/* MOBILE BTN */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        {/* Menu */}
        <div className="p-6 text-white font-bold text-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ClipboardList size={24} />
            </div>
            <p> O.S Premium </p>
          </div>

          {/* X Menu*/}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/dashboard" className={getLinkClass("/dashboard")}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          <Link to="/cliente" className={getLinkClass("/clientes")}>
            <Users size={20} /> Clientes
          </Link>
        </nav>

        {/* Exit Login */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}
