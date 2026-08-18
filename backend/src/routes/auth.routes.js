import { Router } from "express";
import rateLimit from "express-rate-limit";
import AuthController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  registrarValidator,
  loginValidator,
} from "../validators/auth.validator.js";

const loginLimitador = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Muitas tentativas de login. Tente novamente mais tarde." },
});

const authRouter = Router();

authRouter.post(
  "/register",
  registrarValidator,
  validateRequest,
  AuthController.register,
);
authRouter.post(
  "/login",
  loginLimitador,
  loginValidator,
  validateRequest,
  AuthController.login,
);
authRouter.get("/me", authMiddleware(), AuthController.me);

export default authRouter;
