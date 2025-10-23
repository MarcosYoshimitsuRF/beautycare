import { axiosCore } from '@/lib/axiosConfig';
// Importar SOLO el tipo de datos del formulario de Registro
import { type RegisterFormData } from '@/lib/validators/auth';

// Definir un tipo para la respuesta esperada del backend (UsuarioDTO)
// Asegúrate que coincida con lo que devuelve tu backend
interface RegisteredUser {
    id: number;
    username: string;
    enabled: boolean;
    roles: string[];
}

/**
 * Función para llamar al endpoint de registro del backend.
 * @param data Datos del formulario de registro (sin confirmPassword).
 * @returns Promise con la información del usuario registrado.
 */
export const registerUser = async (data: RegisterFormData): Promise<RegisteredUser> => {
    // Excluimos confirmPassword antes de enviar al backend
    const { confirmPassword, ...registerData } = data;
    const response = await axiosCore.post<RegisteredUser>('/auth/register', registerData);
    return response.data;
};

// NOTA: La función para login no es necesaria aquí,
// ya que la llamada se hace directamente en el componente Login.