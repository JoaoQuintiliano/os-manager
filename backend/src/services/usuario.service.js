import prisma from "./prisma.js";

const UsuarioService = {
  async listar() {
    return prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });
  },
};

export default UsuarioService;