import ClienteService from "../services/cliente.service.js";

const ClientController = {
  //armazenar um client
  async store(req, res, next) {
    try {
      const { nome, telefone, email, enderecos } = req.body;

      const novoCliente = await ClienteService.criar({
        nome,
        email,
        telefone,
        enderecos,
      });

      return res.status(201).json(novoCliente);
    } catch (error) {
      next(error);
    }
  },
//exibir cliente
  async index(req, res, next) {
    try {
      const clientes = await ClienteService.listar();
      return res.json(clientes);
    } catch (error) {
      next(error);
    }
  },
//buscar cliente
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const cliente = await ClienteService.exibir({ id });

      if (!cliente) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      return res.json(cliente);
    } catch (error) {
      next(error);
    }
  },
};

export default ClientController;
