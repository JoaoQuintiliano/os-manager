import express from "express";
import cors from "cors";
import "dotenv/config";
import clienteRouter from "./routes/clientes.routes.js";
import authRouter from "./routes/auth.routes.js";
import OsRouter from "./routes/os.routes.js";
import usuarioRouter from "./routes/usuarios.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Sistema de OS API está online" });
});

app.use("/clientes", clienteRouter);
app.use("/os", OsRouter);
app.use("/auth", authRouter);
app.use("/usuarios", usuarioRouter);


app.use((err, req, res, next) => {
  console.error("Erro no Servidor:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
  });
});

export default app;
