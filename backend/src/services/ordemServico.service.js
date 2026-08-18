import prisma from "./prisma.js";

const OrdemServicoService = {
  async criar({
    descricao,
    prioridade,
    prazoSLA,
    clienteId,
    tecnicoId,
    usuarioId,
  }) {
    return prisma.$transaction(async (tx) => {
      const os = await tx.ordemServico.create({
        data: {
          descricao,
          prioridade,
          prazoSLA: new Date(prazoSLA),
          clienteId: Number(clienteId),
          tecnicoId: tecnicoId ? Number(tecnicoId) : null,
          status: "ABERTA",
        },
      });

      await tx.historicoOS.create({
        data: {
          os: { connect: { id: os.id } },
          usuario: { connect: { id: Number(usuarioId) } },
          acao: "ABERTURA",
          observacao: "Ordem de serviço aberta no sistema.",
        },
      });

      return os;
    });
  },

  async atualizarStatus({ id, novoStatus, observacao, usuarioId }) {
    return prisma.$transaction(async (tx) => {
      const os = await tx.ordemServico.update({
        where: { id: Number(id) },
        data: {
          status: novoStatus,
          closedAt: novoStatus === "FINALIZADA" ? new Date() : null,
        },
      });

      await tx.historicoOS.create({
        data: {
          acao: `ALTERAÇÃO DE STATUS: ${novoStatus}`,
          observacao: observacao || `Status alterado para ${novoStatus}`,
          os: { connect: { id: os.id } },
          usuario: { connect: { id: usuarioId } },
        },
      });

      return os;
    });
  },

  async listar({
    busca,
    status,
    prioridade,
    ordenar,
    filtro,
    direcao,
    usuarioId,
  }) {
    const camposPermitidos = ["id", "status", "prioridade", "createdAt"];
    const campoOrdenacao = camposPermitidos.includes(ordenar)
      ? ordenar
      : "createdAt";
    const direcaoOrdenacao = direcao === "asc" ? "asc" : "desc";

    const filtroWhere = {};
    if (status) filtroWhere.status = status;
    if (prioridade) filtroWhere.prioridade = prioridade;
    if (busca) {
      filtroWhere.cliente = { is: { nome: { contains: busca } } };
    }
    if (filtro == "minhas") {
      filtroWhere.tecnicoId = Number(usuarioId);
    }
    if (filtro == "ativas") {
      filtroWhere.status = { notIn: ["FINALIZADA", "CANCELADA"] };
    }
    if (filtro === "finalizadas") {
      filtroWhere.status = {
        in: ["FINALIZADA", "CANCELADA"],
      };
    }

    return prisma.ordemServico.findMany({
      where: filtroWhere,
      include: {
        cliente: { select: { nome: true, telefone: true } },
        tecnico: { select: { nome: true } },
      },
      orderBy: { [campoOrdenacao]: direcaoOrdenacao },
    });
  },

  async exibir({ id }) {
    return prisma.ordemServico.findUnique({
      where: { id: Number(id) },
      include: {
        cliente: true,
        historicos: {
          orderBy: { createdAt: "desc" },
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                ativo: true,
              },
            },
          },
        },
      },
    });
  },

  async atribuirTecnico({ id, tecnicoId, usuarioLogadoId }) {
    const os = await prisma.ordemServico.findUnique({
      where: { id: Number(id) },
    });

    if (!os) {
      const error = new Error("Ordem de Serviço não encontrada.");
      error.status = 404;
      throw error;
    }

    const tecnico = await prisma.user.findUnique({
      where: { id: Number(tecnicoId) },
    });

    if (!tecnico || tecnico.role !== "TECNICO") {
      const error = new Error("Técnico inválido ou não encontrado.");
      error.status = 400;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const osAtualizada = await tx.ordemServico.update({
        where: { id: Number(id) },
        data: { tecnicoId: Number(tecnicoId) },
      });

      await tx.historicoOS.create({
        data: {
          os: { connect: { id: Number(id) } },
          usuario: { connect: { id: Number(usuarioLogadoId) } },
          acao: "TÉCNICO ATRIBUÍDO",
          observacao: `OS atribuída ao técnico: ${tecnico.nome}`,
        },
      });

      return osAtualizada;
    });
  },
};

export default OrdemServicoService;
