// Usaremos axiosInventory para llamar al microservicio
import { axiosInventory } from '@/lib/axiosConfig';
import { Proveedor, ProveedorFormData } from '@/lib/validators/proveedor';

const API_URL = '/api/inventory/proveedores'; // Ruta base en inventory-service

export const getProveedores = async (): Promise<Proveedor[]> => {
  const response = await axiosInventory.get<Proveedor[]>(API_URL);
  return response.data;
};

export const createProveedor = async (data: ProveedorFormData): Promise<Proveedor> => {
  const response = await axiosInventory.post<Proveedor>(API_URL, data);
  return response.data;
};

export const updateProveedor = async (id: number, data: ProveedorFormData): Promise<Proveedor> => {
  const response = await axiosInventory.put<Proveedor>(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteProveedor = async (id: number): Promise<void> => {
  await axiosInventory.delete(`${API_URL}/${id}`);
};