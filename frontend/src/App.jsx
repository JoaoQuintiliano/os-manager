import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { OSDetails } from "./pages/OSDetails";
import { Cliente } from "./pages/Cliente";
import { useAuth } from "./hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Carregando...</div>;
  }
  return user ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Carregando...</div>;
  }
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/os/:id"
          element={
            <PrivateRoute>
              <OSDetails />
            </PrivateRoute>
          }
        />
        <Route path="/Cliente" element={<Cliente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
