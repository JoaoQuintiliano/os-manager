import { body } from "express-validator";

export const criarClienteValidator = [
  body("nome")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório"),

  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Email inválido"),

  body("telefone")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Telefone inválido"),

  body("enderecos")
    .isArray({ min: 1 })
    .withMessage("É necessário informar ao menos um endereço"),

  body("enderecos.*.rua")
    .trim()
    .notEmpty()
    .withMessage("Rua é obrigatória para todos os endereços"),

  body("enderecos.*.cidade")
    .trim()
    .notEmpty()
    .withMessage("Cidade é obrigatória para todos os endereços"),

  body("enderecos.*.estado")
    .trim()
    .notEmpty()
    .withMessage("Estado é obrigatório para todos os endereços"),

  body("enderecos.*.cep")
    .trim()
    .notEmpty()
    .withMessage("CEP é obrigatório para todos os endereços"),
];