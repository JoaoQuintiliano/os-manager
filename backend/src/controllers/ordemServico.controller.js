import prisma from "../services/prisma.js";

const OrdemServicoController = {
  async store(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { descricao, prioridade, prazoSLA, clienteId, tecnicoId } =
        req.body;

      const resultado = await prisma.$transaction(async (tx) => {
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

      return res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { novoStatus, observacao } = req.body;

      const usuarioId = req.user?.id;

      if (!usuarioId) {
        return res.status(401).json({
          error: "Usuário não autenticado. Faça login primeiro.",
        });
      }

      const osAtualizada = await prisma.$transaction(async (tx) => {
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

      return res.json(osAtualizada);
    } catch (error) {
      next(error);
    }
  },

  // EXIBIR OS, SHORT + FILTRO
  async index(req, res, next) {
    try {
      const {
        busca,
        status,
        prioridade,
        ordenar = "createdAt",
        direcao = "desc",
      } = req.query;
      const camposPermitidos = ["id", "status", "prioridade", "createdAt"];
      const camposOrdenacao = camposPermitidos.includes(ordenar)
        ? ordenar
        : "createdAt";

      const direcaoOrdenacao = direcao === "asc" ? "asc" : "desc";
      const filtroWhere = {};
      if (status) {
        filtroWhere.status = status;
      }
      if (prioridade) {
        filtroWhere.prioridade = prioridade;
      }

      if (busca) {
        filtroWhere.cliente = {
          is: {
            nome: {
              contains: busca,
            },
          },
        };
      }
      const ordens = await prisma.ordemServico.findMany({
        where: filtroWhere,
        include: {
          cliente: { select: { nome: true, telefone: true } },
          tecnico: { select: { nome: true } },
        },
        orderBy: { [camposOrdenacao]: direcaoOrdenacao },
      });
      return res.json(ordens);
    } catch (error) {
      next(error);
    }
  },
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const os = await prisma.ordemServico.findUnique({
        where: { id: Number(id) },
        include: {
          cliente: true,
          //  tecnico: true,
          historicos: {
            orderBy: { createdAt: "desc" },
            include: { usuario: true },
          },
        },
      });

      if (!os) return res.status(404).json({ error: "OS não encontrada" });
      return res.json(os);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async atribuirTecnico(req, res) {
    try {
      const { id } = req.params;
      const { tecnicoId } = req.body;
      const usuarioLogadoId = req.user.id;

      const os = await prisma.ordemServico.findUnique({
        where: { id: Number(id) },
      });

      if (!os) {
        return res
          .status(404)
          .json({ error: "Ordem de Serviço não encontrada." });
      }

      const tecnico = await prisma.user.findUnique({
        where: { id: Number(tecnicoId) },
      });

      if (!tecnico || tecnico.role !== "TECNICO") {
        return res
          .status(400)
          .json({ error: "Técnico inválido ou não encontrado." });
      }

      const resultado = await prisma.$transaction(async (tx) => {
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

      return res.json(resultado);
    } catch (error) {
      console.error("Erro ao atribuir técnico:", error);
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao atribuir técnico." });
    }
  },
};
export default OrdemServicoController;
