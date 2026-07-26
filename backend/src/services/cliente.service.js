import prisma from "./prisma.js";

const ClienteService = {
  async criar({ nome, email, telefone, enderecos }) {
    return prisma.cliente.create({
      data: {
        nome,
        email: email || null,
        telefone,
        enderecos: {
          create: enderecos.map((endereco) => ({
            rua: endereco.rua,
            cidade: endereco.cidade,
            estado: endereco.estado,
            cep: endereco.cep,
          })),
        },
      },
      include: { enderecos: true },
    });
  },

  async listar() {
    return prisma.cliente.findMany({
      include: {
        enderecos: true,
        _count: { select: { ordens: true } },
      },
      orderBy: { nome: "asc" },
    });
  },

  async exibir({ id }) {
    return prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: { enderecos: true, ordens: true },
    });
  },
};

export default ClienteService;
