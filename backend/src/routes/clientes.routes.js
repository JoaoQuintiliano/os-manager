import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { clienteCreationRules } from "../validators/cliente.validator.js";
import ClientController from "../controllers/clientes.controller.js";

const clienteRouter = Router()

clienteRouter.post("/", clienteCreationRules(), validateRequest, ClientController.store);
clienteRouter.get("/", ClientController.index);
clienteRouter.get("/:id", ClientController.show);

export default clienteRouter