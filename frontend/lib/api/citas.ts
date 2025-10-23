import { axiosCore } from '@/lib/axiosConfig';
import { Cita, CitaFormData, CitaCreatePayload, CitaUpdateEstadoPayload } from '@/lib/validators/cita';
// Importar 'format' en lugar de 'formatISO' o usar ambos si es necesario
import { format } from 'date-fns';

const API_URL = '/citas';

export const getCitas = async (): Promise<Cita[]> => {
  const response = await axiosCore.get<Cita[]>(API_URL);
  return response.data;
};

export const createCita = async (data: CitaFormData): Promise<Cita> => {
   // Preparamos el payload para el backend
   const payload: CitaCreatePayload = {
     clienteId: data.clienteId,
     profesionalId: data.profesionalId,
     servicioId: data.servicioId,
     // **CORRECCIÓN:** Formatear a YYYY-MM-DDTHH:mm:ss (formato local ISO)
     // Esto elimina la información de zona horaria (Z o +/-HH:mm)
     fechaHoraInicio: format(data.fechaHoraInicio, "yyyy-MM-dd'T'HH:mm:ss"),
   };
   console.log("Enviando payload a POST /citas:", payload); // Log para verificar
  const response = await axiosCore.post<Cita>(API_URL, payload);
  return response.data;
};

export const updateCitaEstado = async (id: number, nuevoEstado: string): Promise<Cita> => {
   const payload: CitaUpdateEstadoPayload = { estado: nuevoEstado.toUpperCase() };
  const response = await axiosCore.put<Cita>(`${API_URL}/${id}/estado`, payload);
  return response.data;
};