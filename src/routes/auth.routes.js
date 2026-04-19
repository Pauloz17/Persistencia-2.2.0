import { Router } from "express";
import { signup, login, getProfile } from "../controllers/auten.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { authSchema } from "../schemas/auth.schema.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

// Rutas públicas (sin autenticación)
authRouter.post("/signup", validateSchema(authSchema), signup);
authRouter.post("/login", validateSchema(authSchema), login);

// Ruta protegida (requiere autenticación)
authRouter.get("/profile", verifyToken, getProfile);

export default authRouter;
