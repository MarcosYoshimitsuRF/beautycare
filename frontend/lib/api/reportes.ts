import { axiosCore, axiosInventory } from '@/lib/axiosConfig';
import { ReporteIngresos, ReporteTopServicio } from '@/lib/validators/reportes';
import { Insumo } from '@/lib/validators/insumo';
import { formatISO } from 'date-fns'; // Para formatear fecha a ISO String

/**
 * Obtiene el reporte de ingresos desde beautycare-api.
 * @param desde Fecha y hora de inicio (Date object)
 * @param hasta Fecha y hora de fin (Date object)
 */
export const getReporteIngresos = async (desde: Date, hasta: Date): Promise<ReporteIngresos> => {
  // Formatear fechas a ISO 8601 string que el backend espera
  const params = {
    desde: formatISO(desde), // ex: 2025-10-23T00:00:00.000Z
    hasta: formatISO(hasta), // ex: 2025-10-23T23:59:59.999Z
  };
  const response = await axiosCore.get<ReporteIngresos>('/reportes/ingresos', { params });
  return response.data;
};

/**
 * Obtiene el reporte de top servicios desde beautycare-api.
 * @param desde Fecha y hora de inicio
 * @param hasta Fecha y hora de fin
 */
export const getReporteTopServicios = async (desde: Date, hasta: Date): Promise<ReporteTopServicio[]> => {
   const params = {
    desde: formatISO(desde),
    hasta: formatISO(hasta),
  };
  const response = await axiosCore.get<ReporteTopServicio[]>('/reportes/top-servicios', { params });
  return response.data;
};

/**
 * Obtiene el reporte de insumos bajo stock desde inventory-service.
 */
export const getReporteInsumosBajoStock = async (): Promise<Insumo[]> => {
  const response = await axiosInventory.get<Insumo[]>('/api/inventory/reportes/insumos-bajo-stock');
  return response.data;
};