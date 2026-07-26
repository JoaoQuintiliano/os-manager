import { body } from "express-validator";

export const registrarValidator = [
  body("nome").trim().notEmpty().withMessage("Nome é obrigatório"),

  body("email").isEmail().withMessage("Email inválido"),

  body("senha")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter no mínimo 6 caracteres"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Email inválido"),
  body("senha").notEmpty().withMessage("Senha é obrigatória"),
];