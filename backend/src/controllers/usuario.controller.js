import prisma from "../services/prisma.js";

const UsuarioController = {
  async index(req, res, next) {
    try {
      const usuarios = await prisma.user.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
        },
      });

      return res.json(usuarios);
    } catch (error) {
      next(error);
    }
  },
};

export default UsuarioController;
