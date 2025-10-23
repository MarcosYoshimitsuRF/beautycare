import { axiosCore } from '@/lib/axiosConfig';
import { Servicio, ServicioFormData } from '@/lib/validators/servicio';

export const getServicios = async (): Promise<Servicio[]> => {
  const response = await axiosCore.get<Servicio[]>('/servicios');
  return response.data;
};

export const createServicio = async (data: ServicioFormData): Promise<Servicio> => {
  const response = await axiosCore.post<Servicio>('/servicios', data);
  return response.data;
};

export const updateServicio = async (id: number, data: ServicioFormData): Promise<Servicio> => {
  const response = await axiosCore.put<Servicio>(`/servicios/${id}`, data);
  return response.data;
};

export const deleteServicio = async (id: number): Promise<void> => {
  await axiosCore.delete(`/servicios/${id}`);
};