import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("@SistemaOS:token"));

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("@SistemaOS:user")),
  );

  function login(user, token) {
    setUser(user);
    setToken(token);

    localStorage.setItem("@SistemaOS:user", JSON.stringify(user));
    localStorage.setItem("@SistemaOS:token", token);
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("@SistemaOS:user");
    localStorage.removeItem("@SistemaOS:token");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
