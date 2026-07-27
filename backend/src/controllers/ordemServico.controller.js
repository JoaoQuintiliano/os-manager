import OrdemServicoService from "../services/ordemServico.service.js";

const OrdemServicoController = {
  //armazenar os
  async store(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { descricao, prioridade, prazoSLA, clienteId, tecnicoId } =
        req.body;

      const resultado = await OrdemServicoService.criar({
        descricao,
        prioridade,
        prazoSLA,
        clienteId,
        tecnicoId,
        usuarioId,
      });

      return res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  },
  //editar status os
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { novoStatus, observacao } = req.body;
      const usuarioId = req.user?.id;

      if (!usuarioId) {
        return res
          .status(401)
          .json({ error: "Usuário não autenticado. Faça login primeiro." });
      }

      const osAtualizada = await OrdemServicoService.atualizarStatus({
        id,
        novoStatus,
        observacao,
        usuarioId,
      });

      return res.json(osAtualizada);
    } catch (error) {
      next(error);
    }
  },
  //exibir os e filtro dashboard
  async index(req, res, next) {
    try {
      const {
        busca,
        status,
        prioridade,
        ordenar = "createdAt",
        direcao = "desc",
      } = req.query;

      const ordens = await OrdemServicoService.listar({
        busca,
        status,
        prioridade,
        ordenar,
        direcao,
      });

      return res.json(ordens);
    } catch (error) {
      next(error);
    }
  },
  //buscar por id
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const os = await OrdemServicoService.exibir({ id });

      if (!os) {
        return res.status(404).json({ error: "OS não encontrada" });
      }

      return res.json(os);
    } catch (error) {
      next(error);
    }
  },
  //atribuir um tecnic
  async atribuirTecnico(req, res, next) {
    try {
      const { id } = req.params;
      const { tecnicoId } = req.body;
      const usuarioLogadoId = req.user.id;

      const resultado = await OrdemServicoService.atribuirTecnico({
        id,
        tecnicoId,
        usuarioLogadoId,
      });

      return res.json(resultado);
    } catch (error) {
      next(error);
    }
  },
};

export default OrdemServicoController;
