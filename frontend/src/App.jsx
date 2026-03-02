import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { OSDetails } from "./pages/OSDetails";
import { Cliente } from "./pages/Cliente";

const isAutenticado = () => !!localStorage.getItem("@SistemaOS:token");

const PrivateRoute = ({ children }) => {
  return isAutenticado() ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
  return isAutenticado() ? <Navigate to="/dashboard" /> : children;
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
