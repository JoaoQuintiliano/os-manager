import jwt from "jsonwebtoken";

const authMiddleware = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido" });
    }
    const [, token] = authHeader.split(" ");

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "chave_secreta_fallback",
      );

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
