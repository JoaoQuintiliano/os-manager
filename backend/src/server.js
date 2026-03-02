import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
  ==========================================
  Servidor rodando na porta: ${PORT}
  URL: http://localhost:${PORT}
  Data: ${new Date().toLocaleString()}
  ==========================================
  `);
});

process.on("unhandledRejection", (err) => {
  console.error("Alerta: Erro não tratado:", err);
  server.close(() => process.exit(1));
});
