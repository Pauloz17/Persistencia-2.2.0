import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse, errorResponse } from "../utils/response.handler.js";

// Registrar nuevo usuario (con encriptación de contraseña)
export const signup = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario ya existe
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    return errorResponse(
      res,
      400,
      "El email ya está registrado",
      ["Este email ya tiene una cuenta asociada"]
    );
  }

  const salt = await bcrypt.genSalt(10);

  // Encriptar la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear el usuario con la contraseña encriptada
  const newUser = await UserModel.create(email, hashedPassword);

  return successResponse(res, 201, "Usuario registrado exitosamente", newUser);
});

// Iniciar sesión y generar JWT
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Buscar el usuario por email
  const user = await UserModel.findByEmail(email);
  if (!user) {
    return errorResponse(
      res,
      401,
      "Credenciales inválidas",
      ["Email o contraseña incorrectos"]
    );
  }

  // Comparar la contraseña con la encriptada en BD
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return errorResponse(
      res,
      401,
      "Credenciales inválidas",
      ["Email o contraseña incorrectos"]
    );
  }

  // Generar JWT con expiración de 1 hora
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "tu_clave_secreta_super_segura",
    { expiresIn: "1h" }
  );

  // Obtener los roles/permisos del usuario
  const roles = await UserModel.getRoles(user.id);

  return successResponse(res, 200, "Sesión iniciada exitosamente", {
    user: {
      id: user.id,
      email: user.email,
    },
    token,
    roles,
  });
});

// Obtener perfil del usuario autenticado
export const getProfile = catchAsync(async (req, res) => {
  // El usuario viene en req.user gracias al middleware de autenticación
  const user = await UserModel.findById(req.user.userId);

  if (!user) {
    return errorResponse(
      res,
      404,
      "Usuario no encontrado",
      ["El usuario autenticado no existe"]
    );
  }

  return successResponse(res, 200, "Perfil obtenido", user);
});
