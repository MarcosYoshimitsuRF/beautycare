import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// URLs base de nuestros backends (locales para desarrollo)
// En producción (Fase 8), estas deberían leerse de variables de entorno
const API_CORE_URL: string = process.env.NEXT_PUBLIC_API_CORE_URL || 'http://localhost:8080';
const API_INVENTORY_URL: string = process.env.NEXT_PUBLIC_API_INVENTORY_URL || 'http://localhost:8081';

// --- Instancia para el Servicio Core (beautycare-api) ---
const axiosCore: AxiosInstance = axios.create({
  baseURL: API_CORE_URL,
  headers: {
    'Content-Type': 'application/json', // Por defecto enviamos JSON
  }
});

// --- Instancia para el Servicio de Inventario (inventory-service) ---
const axiosInventory: AxiosInstance = axios.create({
  baseURL: API_INVENTORY_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Interceptor para añadir el token JWT a TODAS las peticiones salientes
 * de ambas instancias de Axios.
 */
const addAuthTokenInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      // Obtenemos el token desde localStorage (o tu gestor de estado)
      let token: string | null = null;
      if (typeof window !== 'undefined') { // Solo ejecutar en el cliente
        token = localStorage.getItem('jwtToken');
      }

      if (token) {
        // Aseguramos que config.headers exista antes de modificarlo
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
      // Manejo de errores en la configuración de la petición
      return Promise.reject(error);
    }
  );

  // Opcional: Interceptor para manejar errores 401/403 globalmente
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response, // Pasa la respuesta si es exitosa
    (error: AxiosError): Promise<AxiosError> => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.error("Error de autenticación/autorización:", error.response.data);
        // Aquí podrías limpiar el token y redirigir al login
        // if (typeof window !== 'undefined') {
        //   localStorage.removeItem('jwtToken');
        //   // Usa el router de Next.js para redirigir programáticamente si estás en un hook o componente
        //   // O window.location.href = '/login'; para una redirección simple
        // }
      }
      return Promise.reject(error); // Propaga el error para manejo local
    }
  );
};

// Aplicamos los interceptores a ambas instancias
addAuthTokenInterceptor(axiosCore);
addAuthTokenInterceptor(axiosInventory);

// Exportamos las instancias configuradas
export { axiosCore, axiosInventory };