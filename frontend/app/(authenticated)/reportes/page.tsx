"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DateRange } from "react-day-picker";
import { subDays, startOfDay, endOfDay } from "date-fns"; // Helpers para fechas

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/ui/date-range-picker"; // Importar
import { ReporteIngresos, ReporteTopServicio } from "@/lib/validators/reportes";
import { Insumo } from "@/lib/validators/insumo";
import {
  getReporteIngresos,
  getReporteTopServicios,
  getReporteInsumosBajoStock,
} from "@/lib/api/reportes";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Package, RefreshCw, Star, TrendingUp } from "lucide-react";

// Helper para formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
};

export default function ReportesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState({
    ingresos: false,
    top: false,
    stock: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Estado para el selector de fechas (inicializa con los últimos 7 días)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(subDays(new Date(), 7)),
    to: endOfDay(new Date()),
  });

  // Estados para los datos de los reportes
  const [reporteIngresos, setReporteIngresos] =
    useState<ReporteIngresos | null>(null);
  const [reporteTopServicios, setReporteTopServicios] = useState<
    ReporteTopServicio[]
  >([]);
  const [reporteStockBajo, setReporteStockBajo] = useState<Insumo[]>([]);

  // Función para cargar todos los reportes (o específicos)
  const fetchReports = useCallback(
    async (reportType: "all" | "date" | "stock" = "all") => {
      setError(null);
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.replace("/login");
        return;
      }

      const fetchIngresos = async () => {
        if (!dateRange?.from || !dateRange?.to) return;
        setIsLoading((prev) => ({ ...prev, ingresos: true }));
        try {
          const data = await getReporteIngresos(
            startOfDay(dateRange.from),
            endOfDay(dateRange.to)
          );
          setReporteIngresos(data);
        } catch (err) {
          handleApiError(err, "ingresos");
        } finally {
          setIsLoading((prev) => ({ ...prev, ingresos: false }));
        }
      };

      const fetchTopServicios = async () => {
        if (!dateRange?.from || !dateRange?.to) return;
        setIsLoading((prev) => ({ ...prev, top: true }));
        try {
          const data = await getReporteTopServicios(
            startOfDay(dateRange.from),
            endOfDay(dateRange.to)
          );
          setReporteTopServicios(data);
        } catch (err) {
          handleApiError(err, "top servicios");
        } finally {
          setIsLoading((prev) => ({ ...prev, top: false }));
        }
      };

      const fetchStockBajo = async () => {
        setIsLoading((prev) => ({ ...prev, stock: true }));
        try {
          const data = await getReporteInsumosBajoStock();
          setReporteStockBajo(data);
        } catch (err) {
          handleApiError(err, "stock bajo");
        } finally {
          setIsLoading((prev) => ({ ...prev, stock: false }));
        }
      };

      if (reportType === "all" || reportType === "date") {
        await Promise.all([fetchIngresos(), fetchTopServicios()]);
      }
      if (reportType === "all" || reportType === "stock") {
        await fetchStockBajo();
      }
    },
    [dateRange, router, toast]
  ); // Dependencias del useCallback

  // Carga inicial de todos los reportes
  useEffect(() => {
    fetchReports("all");
  }, [fetchReports]); // Ejecutar solo cuando fetchReports cambie (debido a dateRange)

  // Handler para errores API
  const handleApiError = (err: unknown, reportName: string) => {
    console.error(`Error fetching reporte ${reportName}:`, err);
    let errMsg = `Error desconocido al cargar reporte ${reportName}.`;
    if (axios.isAxiosError(err))
      errMsg = err.response?.data?.message || err.message;
    else if (err instanceof Error) errMsg = err.message;
    setError(`No se pudo cargar el reporte: ${reportName}.`);
    toast({
      variant: "destructive",
      title: `Error Carga ${reportName}`,
      description: errMsg,
    });
  };

  // Handler para cuando cambia el rango de fechas
  const handleDateChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
    // Vuelve a cargar solo los reportes dependientes de fecha
    if (newRange?.from && newRange?.to) {
      fetchReports("date");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold">Reportes</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker date={dateRange} onDateChange={handleDateChange} />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchReports("all")}
            disabled={isLoading.ingresos || isLoading.top || isLoading.stock}
          >
            <RefreshCw
              className={cn(
                "h-4 w-4",
                (isLoading.ingresos || isLoading.top || isLoading.stock) &&
                  "animate-spin"
              )}
            />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card Reporte Ingresos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading.ingresos ? (
              <p>Cargando...</p>
            ) : reporteIngresos ? (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(reporteIngresos.ingresosTotales)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Basado en {reporteIngresos.numeroDePagos} pagos registrados en
                  el período.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No hay datos.</p>
            )}
          </CardContent>
        </Card>

        {/* Card Reporte Top Servicios */}
        <Card className="lg:col-span-2">
          {" "}
          {/* Ocupa dos columnas en pantallas grandes */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Star className="h-4 w-4 text-muted-foreground" />
              Top Servicios Solicitados
            </CardTitle>
            <CardDescription>
              Servicios más agendados en el período seleccionado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading.top ? (
              <p>Cargando...</p>
            ) : reporteTopServicios.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporteTopServicios.map((item) => (
                    <TableRow key={item.servicioId}>
                      <TableCell className="font-medium">
                        {item.nombreServicio}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.cantidadSolicitada}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay datos de citas en este período.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card Reporte Stock Bajo */}
        <Card className="md:col-span-2 lg:col-span-3">
          {" "}
          {/* Ocupa ancho completo en mediano y grande */}
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4 text-muted-foreground" />
              Insumos con Stock Bajo
            </CardTitle>
            <CardDescription>
              Insumos cuyo stock actual es menor o igual al mínimo definido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading.stock ? (
              <p>Cargando...</p>
            ) : reporteStockBajo.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Insumo</TableHead>
                    <TableHead className="text-right">Stock Actual</TableHead>
                    <TableHead className="text-right">Stock Mínimo</TableHead>
                    <TableHead>Unidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporteStockBajo.map((item) => (
                    <TableRow
                      key={item.id}
                      className="text-destructive font-medium"
                    >
                      {" "}
                      {/* Resaltar fila */}
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell className="text-right">{item.stock}</TableCell>
                      <TableCell className="text-right">
                        {item.stockMinimo}
                      </TableCell>
                      <TableCell>{item.unidad || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                ¡Todo en orden! No hay insumos con stock bajo.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
