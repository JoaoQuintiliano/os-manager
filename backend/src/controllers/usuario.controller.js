import UsuarioService from "../services/usuario.service.js";


const UsuarioController = {
  //listar users
  async index(req, res, next) {
    try {
      const usuarios = await UsuarioService.listar();
      return res.json(usuarios);
    } catch (error) {
      next(error);
    }
  },
};

export default UsuarioController;
