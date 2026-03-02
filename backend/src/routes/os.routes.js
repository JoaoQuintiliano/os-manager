import { Router } from "express";
import OrdemServicoController from "../controllers/ordemServico.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validarNovaOS } from "../validators/ordemServico.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
const Osrouter = Router();

Osrouter.get("/", authMiddleware(), OrdemServicoController.index);

Osrouter.post(
  "/",
  validarNovaOS,
  validateRequest,
  authMiddleware(["ADMIN", "USER"]),
  OrdemServicoController.store,
);

Osrouter.patch(
  "/:id/status",
  authMiddleware(["ADMIN", "TECNICO"]),
  OrdemServicoController.updateStatus,
);
Osrouter.patch(
  "/:id/tecnico",
  authMiddleware(["USER", "ADMIN"]),
  OrdemServicoController.atribuirTecnico,
);
Osrouter.get("/:id", OrdemServicoController.show);

export default Osrouter;
