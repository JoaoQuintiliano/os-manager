import { body, param } from "express-validator";

export const clienteCreationRules = () => {
  return [
    body("nome")
      .isString()
      .withMessage("Digite um nome válido!")
      .notEmpty()
      .withMessage("O campo Nome é obrigatorio!"),
    body("telefone")
      .isString()
      .withMessage("Digite um telefone válido!")
      .notEmpty()
      .withMessage("O campo Telefone é obrigatorio!"),
    body("email")
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage("Digite um email válido!"),
  ];
};
