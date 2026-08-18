import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("@SistemaOS:token");
  });

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  function login(user, token) {
    setUser(user);
    setToken(token);

    localStorage.setItem("@SistemaOS:token", token);
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("@SistemaOS:token");
  }

  useEffect(() => {
    async function validarSessao() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    }

    validarSessao();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
