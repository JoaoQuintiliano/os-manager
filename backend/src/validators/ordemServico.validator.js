import { body } from "express-validator";

export const validarNovaOS = [
  body("clienteId")
    .notEmpty().withMessage("O cliente é obrigatório.")
    .isInt().withMessage("ID do cliente inválido."),
    
  body("descricao")
    .isString()
    .isLength({ min: 10 }).withMessage("A descrição deve ter no mínimo 10 caracteres para ajudar o técnico."),
    
  body("prioridade")
    .isIn(["NORMAL","ALTA"]).withMessage("Prioridade inválida."),
    
  body("prazoSLA")
    .isISO8601().withMessage("Formato de data inválido.")
    .custom((value) => {
      const dataSLA = new Date(value);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      dataSLA.setHours(0, 0, 0, 0);

      if (dataSLA < hoje) {
        throw new Error("O Prazo Limite não pode ser uma data no passado.");
      }
      return true;
    })
];