import { body, param, query } from "express-validator";

const STATUS_VALIDOS = ["ABERTA", "EM_ANDAMENTO","AGUARDANDO_PECA", "FINALIZADA", "CANCELADA"];
const PRIORIDADES_VALIDAS = ["NORMAL", "ALTA"];
const CAMPOS_ORDENACAO_VALIDOS = ["id", "status", "prioridade", "createdAt"];

// validação criar
export const criarOrdemServicoValidator = [
  body("descricao").trim().notEmpty().withMessage("Descrição é obrigatória"),

  body("prioridade")
    .isIn(PRIORIDADES_VALIDAS)
    .withMessage(
      `Prioridade deve ser uma de: ${PRIORIDADES_VALIDAS.join(", ")}`,
    ),

  body("prazoSLA")
    .notEmpty()
    .withMessage("Prazo SLA é obrigatório")
    .isISO8601()
    .withMessage("Prazo SLA deve ser uma data válida (formato ISO 8601)"),

  body("clienteId")
    .notEmpty()
    .withMessage("Cliente é obrigatório")
    .isInt({ min: 1 })
    .withMessage("clienteId deve ser um número inteiro válido"),

  body("tecnicoId")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("tecnicoId deve ser um número inteiro válido"),
];

// validação att status
export const atualizarStatusValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("id da OS deve ser um número inteiro válido"),

  body("novoStatus")
    .isIn(STATUS_VALIDOS)
    .withMessage(`Status deve ser um de: ${STATUS_VALIDOS.join(", ")}`),

  body("observacao")
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage("Observação inválida"),
];

// validação listagem e filtro
export const listarOrdemServicoValidator = [
  query("status")
    .optional({ checkFalsy: true })
    .isIn(STATUS_VALIDOS)
    .withMessage(`Status deve ser um de: ${STATUS_VALIDOS.join(", ")}`),

  query("prioridade")
    .optional({ checkFalsy: true })
    .isIn(PRIORIDADES_VALIDAS)
    .withMessage(
      `Prioridade deve ser uma de: ${PRIORIDADES_VALIDAS.join(", ")}`,
    ),

  query("ordenar")
    .optional({ checkFalsy: true })
    .isIn(CAMPOS_ORDENACAO_VALIDOS)
    .withMessage(
      `Campo de ordenação inválido. Use um de: ${CAMPOS_ORDENACAO_VALIDOS.join(", ")}`,
    ),

  query("direcao")
    .optional({ checkFalsy: true })
    .isIn(["asc", "desc"])
    .withMessage("Direção deve ser 'asc' ou 'desc'"),
];

// validação exibir por id
export const idOrdemServicoValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("id da OS deve ser um número inteiro válido"),
];

// validação atribuir tecn
export const atribuirTecnicoValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("id da OS deve ser um número inteiro válido"),

  body("tecnicoId")
    .notEmpty()
    .withMessage("tecnicoId é obrigatório")
    .isInt({ min: 1 })
    .withMessage("tecnicoId deve ser um número inteiro válido"),
];
