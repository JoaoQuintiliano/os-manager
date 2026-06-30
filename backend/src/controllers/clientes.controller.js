import prisma from "../services/prisma.js";

const ClientController = {
  // --- STORE (CRIAR) ---
  async store(req, res, next) {
    try {
      const { nome, telefone, email, endereco } = req.body;

      if (!endereco || !endereco.rua) {
        return res.status(400).json({ error: "Endereço (Rua) é obrigatório" });
      }

      const novoCliente = await prisma.cliente.create({
        data: {
          nome,
          email: email || null,
          telefone,
          enderecos: {
            create: {
              rua: endereco.rua,
              cidade: endereco.cidade,
              estado: endereco.estado,
              cep: endereco.cep,
            },
          },
        },
        include: { enderecos: true },
      });

      return res.status(201).json(novoCliente);
    } catch (error) {
      next(error);
    }
  },

  // --- INDEX (LISTAR) ---
  async index(req, res, next) {
    try {
      const clientes = await prisma.cliente.findMany({
        include: {
          enderecos: true,
          _count: { select: { ordens: true } },
        },
        orderBy: { nome: "asc" },
      });
      return res.json(clientes);
    } catch (error) {
      next(error);
    }
  },

  // --- SHOW (DETALHES) ---
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const cliente = await prisma.cliente.findUnique({
        where: { id: Number(id) },
        include: { enderecos: true, ordens: true },
      });

      if (!cliente)
        return res.status(404).json({ error: "Cliente não encontrado" });
      return res.json(cliente);
    } catch (error) {
      next(error);
    }
  },
};

export default ClientController;
