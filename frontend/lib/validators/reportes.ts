import { Servicio } from "./servicio"; // Reutilizar tipo si es necesario o definir uno simple
import { Insumo } from "./insumo";   // Reutilizar tipo Insumo

// Tipo para el reporte de Ingresos (desde beautycare-api)
export interface ReporteIngresos {
  ingresosTotales: number; // BigDecimal se convierte a number
  numeroDePagos: number;   // Long se convierte a number
}

// Tipo para el reporte Top Servicios (desde beautycare-api)
export interface ReporteTopServicio {
  servicioId: number;
  nombreServicio: string;
  cantidadSolicitada: number; // Long se convierte a number
}

// El reporte de Insumos Bajo Stock usa el tipo Insumo ya definido
// export interface ReporteInsumoBajoStock extends Insumo {} // No es necesario redefinir