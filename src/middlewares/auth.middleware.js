import jwt from "jsonwebtoken";

// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization (formato: "Bearer token")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado o formato inválido",
        data: [],
        errors: ["El header Authorization debe estar en formato 'Bearer <token>'"],
      });
    }

    // Extraer el token sin "Bearer "
    const token = authHeader.slice(7);

    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "tu_clave_secreta_super_segura"
    );

    // Guardar los datos del usuario en req.user para usarlos en controladores
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
        data: [],
        errors: ["Por favor, inicia sesión nuevamente"],
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
        data: [],
        errors: ["El token no es válido"],
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al verificar el token",
      data: [],
      errors: [error.message],
    });
  }
};
