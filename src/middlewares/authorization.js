import { UserModel } from "../models/user.model.js";

// Middleware de autorización que verifica permisos
// Se usa como: authorize('products.create')
export const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Obtener el userId del req.user (establecido por verifyToken)
      const userId = req.user.userId;

      // Obtener los roles/permisos del usuario
      const userRoles = await UserModel.getRoles(userId);

      // Verificar si el usuario tiene el permiso requerido
      if (!userRoles.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          message: "Acceso denegado",
          data: [],
          errors: [`No tienes el permiso requerido: ${requiredPermission}`],
        });
      }

      // Si tiene el permiso, continuar
      next();
    } catch (error) {
      console.error("Error en middleware de autorización:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        data: [],
        errors: ["Error al verificar permisos"],
      });
    }
  };
};