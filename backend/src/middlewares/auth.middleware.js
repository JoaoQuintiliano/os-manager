import jwt from "jsonwebtoken";

const authMiddleware = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido" });
    }
    const [, token] = authHeader.split(" ");

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET não configurado na variável de ambiente");
      }
      const decoded = jwt.verify(token, secret);

      req.user = decoded;
      if (
        rolesPermitidos.length > 0 &&
        !rolesPermitidos.includes(decoded.role)
      ) {
        return res
          .status(403)
          .json({ error: "Acesso proibido: seu cargo não permite esta ação" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
  };
};

export default authMiddleware;
