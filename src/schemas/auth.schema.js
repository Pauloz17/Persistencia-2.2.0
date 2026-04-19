import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .email("El email debe ser válido")
    .min(5, "El email debe tener al menos 5 caracteres"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres"),
});
