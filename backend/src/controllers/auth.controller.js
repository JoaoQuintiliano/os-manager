import AuthService from "../services/auth.service.js";

const AuthController = {
  //registrar user
  async register(req, res, next) {
    try {
      const { nome, email, senha } = req.body;

      const newUser = await AuthService.registrar({ nome, email, senha });

      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
  //logar
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      const { user, token } = await AuthService.login({ email, senha });

      return res.json({ user, token });
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;
