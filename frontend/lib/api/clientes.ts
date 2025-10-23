import { axiosCore } from '@/lib/axiosConfig';
import { Cliente, ClienteFormData } from '@/lib/validators/cliente';

export const getClientes = async (): Promise<Cliente[]> => {
  const response = await axiosCore.get<Cliente[]>('/clientes');
  return response.data;
};

export const createCliente = async (data: ClienteFormData): Promise<Cliente> => {
  const response = await axiosCore.post<Cliente>('/clientes', data);
  return response.data;
};

export const updateCliente = async (id: number, data: ClienteFormData): Promise<Cliente> => {
  const response = await axiosCore.put<Cliente>(`/clientes/${id}`, data);
  return response.data;
};

export const deleteCliente = async (id: number): Promise<void> => {
  await axiosCore.delete(`/clientes/${id}`);
};