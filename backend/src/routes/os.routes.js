import { Router } from "express";
import OrdemServicoController from "../controllers/ordemServico.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  criarOrdemServicoValidator,
  atualizarStatusValidator,
  atribuirTecnicoValidator,
  idOrdemServicoValidator,
} from "../validators/ordemServico.validator.js";

const osRouter = Router();

osRouter.get("/", authMiddleware(), OrdemServicoController.index);

osRouter.get(
  "/:id",
  authMiddleware(),
  idOrdemServicoValidator,
  validateRequest,
  OrdemServicoController.show,
);

osRouter.post(
  "/",
  authMiddleware(["ADMIN", "USER"]),
  criarOrdemServicoValidator,
  validateRequest,
  OrdemServicoController.store,
);

//patch status
osRouter.patch( 
  "/:id/status",
  authMiddleware(["ADMIN", "TECNICO"]),
  atualizarStatusValidator,
  validateRequest,
  OrdemServicoController.updateStatus,
);
//patch tecnico
osRouter.patch(
  "/:id/tecnico",
  authMiddleware(["USER", "ADMIN"]),
  atribuirTecnicoValidator,
  validateRequest,
  OrdemServicoController.atribuirTecnico,
);

export default osRouter;
