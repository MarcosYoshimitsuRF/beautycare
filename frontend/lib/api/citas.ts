import { axiosCore } from '@/lib/axiosConfig';
import { Cita, CitaFormData, CitaCreatePayload, CitaUpdateEstadoPayload } from '@/lib/validators/cita';
import { formatISO } from 'date-fns';

const API_URL = '/citas';

export const getCitas = async (): Promise<Cita[]> => {
  const response = await axiosCore.get<Cita[]>(API_URL);
  return response.data;
};

export const createCita = async (data: CitaFormData): Promise<Cita> => {
   const payload: CitaCreatePayload = {
     clienteId: data.clienteId,
     profesionalId: data.profesionalId,
     servicioId: data.servicioId,
     // Asegurarse que la fecha/hora se formatea correctamente a ISO String UTC o local apropiado
     fechaHoraInicio: formatISO(data.fechaHoraInicio),
   };
  const response = await axiosCore.post<Cita>(API_URL, payload);
  return response.data;
};

export const updateCitaEstado = async (id: number, nuevoEstado: string): Promise<Cita> => {
   const payload: CitaUpdateEstadoPayload = { estado: nuevoEstado.toUpperCase() }; // Asegurar mayúsculas
  const response = await axiosCore.put<Cita>(`${API_URL}/${id}/estado`, payload);
  return response.data;
};