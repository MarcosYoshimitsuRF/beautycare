import * as z from "zod";

// Esquema de validación para el formulario de Login
export const LoginSchema = z.object({
  username: z.string().min(1, { message: "El nombre de usuario es requerido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});
// Tipo inferido para datos del formulario de Login
export type LoginFormData = z.infer<typeof LoginSchema>;


// Esquema de validación para el formulario de Registro
export const RegisterSchema = z.object({
  username: z.string().min(3, { message: "Mínimo 3 caracteres" }).max(100),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "Mínimo 6 caracteres" }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"], // Asociar error al campo de confirmación
});
// Tipo inferido para datos del formulario de Registro
export type RegisterFormData = z.infer<typeof RegisterSchema>;