import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./prisma.js";

const AuthService = {
  async registrar({ nome, email, senha }) {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      const error = new Error("Este e-mail já está em uso.");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    return prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        role: "TECNICO",
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });
  },

  async login({ email, senha }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.ativo) {
      const error = new Error("Credenciais inválidas ou usuário inativo");
      error.status = 401;
      throw error;
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      const error = new Error("Credenciais inválidas");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const { senha: _senha, ...userSemSenha } = user;

    return { user: userSemSenha, token };
  },
};

export default AuthService;
