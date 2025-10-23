import { axiosCore } from '@/lib/axiosConfig';
import { Profesional, ProfesionalFormData } from '@/lib/validators/profesional';

export const getProfesionales = async (): Promise<Profesional[]> => {
  const response = await axiosCore.get<Profesional[]>('/profesionales');
  return response.data;
};

export const createProfesional = async (data: ProfesionalFormData): Promise<Profesional> => {
  const response = await axiosCore.post<Profesional>('/profesionales', data);
  return response.data;
};

export const updateProfesional = async (id: number, data: ProfesionalFormData): Promise<Profesional> => {
  const response = await axiosCore.put<Profesional>(`/profesionales/${id}`, data);
  return response.data;
};

export const deleteProfesional = async (id: number): Promise<void> => {
  await axiosCore.delete(`/profesionales/${id}`);
};