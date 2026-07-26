import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { criarClienteValidator } from "../validators/cliente.validator.js";
import ClientController from "../controllers/clientes.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const clienteRouter = Router();

clienteRouter.post(
  "/",
  authMiddleware(["ADMIN", "USER"]),
  criarClienteValidator,
  validateRequest,
  ClientController.store,
);

clienteRouter.get("/", authMiddleware(), ClientController.index);

clienteRouter.get("/:id", authMiddleware(), ClientController.show);

export default clienteRouter;
