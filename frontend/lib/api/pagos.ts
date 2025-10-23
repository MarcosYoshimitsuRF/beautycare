import { axiosCore } from '@/lib/axiosConfig';
import { Pago, PagoFormData } from '@/lib/validators/pago';

const API_URL = '/pagos';

// Obtener todos los pagos (backend no filtra, podríamos filtrar en frontend)
export const getPagos = async (): Promise<Pago[]> => {
  const response = await axiosCore.get<Pago[]>(API_URL);
  return response.data;
};

// Registrar un nuevo pago
export const createPago = async (data: PagoFormData): Promise<Pago> => {
  // El backend asigna la fechaHora
  const response = await axiosCore.post<Pago>(API_URL, data);
  return response.data;
};

// No hay update ni delete para pagos según el plan