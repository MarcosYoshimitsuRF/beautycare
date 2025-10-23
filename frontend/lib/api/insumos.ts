// Usaremos axiosInventory para llamar al microservicio
import { axiosInventory } from '@/lib/axiosConfig';
import { Insumo, InsumoFormData } from '@/lib/validators/insumo';

const API_URL = '/api/inventory/insumos'; // Ruta base en inventory-service

export const getInsumos = async (): Promise<Insumo[]> => {
  const response = await axiosInventory.get<Insumo[]>(API_URL);
  return response.data;
};

export const createInsumo = async (data: InsumoFormData): Promise<Insumo> => {
  const response = await axiosInventory.post<Insumo>(API_URL, data);
  return response.data;
};

export const updateInsumo = async (id: number, data: InsumoFormData): Promise<Insumo> => {
  const response = await axiosInventory.put<Insumo>(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteInsumo = async (id: number): Promise<void> => {
  await axiosInventory.delete(`${API_URL}/${id}`);
};