import { axiosInventory } from '@/lib/axiosConfig';
import { Compra, CompraRegisterFormData } from '@/lib/validators/compra';
import { format } from 'date-fns'; // Library to format dates (npm install date-fns)

const API_URL = '/api/inventory/compras';

export const getCompras = async (): Promise<Compra[]> => {
  const response = await axiosInventory.get<Compra[]>(API_URL);
  // Optional: Format date string here if needed, or format in the table
  return response.data;
};

// Function to REGISTER a purchase and REPLENISH stock
export const registerCompra = async (data: CompraRegisterFormData): Promise<Compra> => {
   // Format date to YYYY-MM-DD string for the backend
   const formattedData = {
     ...data,
     fecha: format(data.fecha, 'yyyy-MM-dd'),
   };
  const response = await axiosInventory.post<Compra>(API_URL, formattedData);
  return response.data;
};

// No update or delete functions as per backend implementation