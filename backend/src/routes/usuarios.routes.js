import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const usuarioRouter = Router();

usuarioRouter.get(
  "/",
  authMiddleware(["ADMIN", "USER"]),
  UsuarioController.index,
);

export default usuarioRouter;
