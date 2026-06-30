import bcrypt from "bcrypt";
import prisma from "../services/prisma.js";
import jwt from "jsonwebtoken";

const AuthController = {
  async register(req, res, next) {
    try {
      const { nome, email, senha, role } = req.body;
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "Este e-mail já está em uso." });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const newUser = await prisma.user.create({
        data: {
          nome,
          email,
          senha: hashedPassword,
          role: role || "TECNICO",
        },
      });

      delete newUser.senha;
      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.ativo) {
        return res
          .status(401)
          .json({ error: "Credenciais inválidas ou usuário inativo" });
      }

      const senhaValida = await bcrypt.compare(senha, user.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "chave_secreta_fallback",
        { expiresIn: "1d" },
      );

      delete user.senha;
      return res.json({ user, token });
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;
