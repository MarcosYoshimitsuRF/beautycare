'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/pagos/columns'; // Importar columnas de pagos
import { Pago } from '@/lib/validators/pago';
import { getPagos } from '@/lib/api/pagos';         // Importar API de pagos
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// No AlertDialog para pagos
import { PagoForm } from '@/components/pagos/PagoForm'; // Importar Form de pagos
import { useToast } from '@/components/ui/use-toast';

export default function PagosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para diálogo de registro
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Podríamos recibir citaId si venimos de un botón "Pagar" en la lista de citas
  // const [selectedCitaId, setSelectedCitaId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) { router.replace('/login'); return; }
    // TODO: Verificar rol (CLIENTE/STAFF/ADMIN pueden ver/registrar pagos)
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getPagos();
      // TODO: Filtrar por cliente si el rol es CLIENTE
      setPagos(data);
    } catch (err: unknown) {
      console.error("Error fetching pagos:", err);
      let errMsg = "Error desconocido.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      setError("No se pudieron cargar los pagos.");
      toast({ variant: "destructive", title: "Error Carga", description: errMsg });
    } finally { setIsLoading(false); }
  };

  // Handlers
  const handleOpenCreateForm = (/*citaId?: number*/) => {
    // setSelectedCitaId(citaId || null); // Guardar ID si viene
    setIsFormOpen(true);
  };
  const handleCloseForm = () => { setIsFormOpen(false); /*setSelectedCitaId(null);*/ };
  const handleFormSubmitSuccess = () => {
    handleCloseForm();
    toast({ title: "Éxito", description: "Pago registrado correctamente." });
    fetchData(); // Recargar tabla
  };

  // No hay acciones Edit/Delete

  if (isLoading) return <div className="p-6">Cargando pagos...</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Historial de Pagos</h1>
        <Button onClick={() => handleOpenCreateForm()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Registrar Nuevo Pago
        </Button>
      </div>

      <DataTable
        columns={columns} // Columnas sin acciones
        data={pagos}
        // Podríamos filtrar por ID Cita o Fecha
        // filterColumnId="citaId"
      />

      {/* --- Diálogo Registrar Pago --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Pago</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del pago realizado para una cita.
            </DialogDescription>
          </DialogHeader>
          {isFormOpen && (
             <PagoForm
              // initialCitaId={selectedCitaId} // Pasar ID si se seleccionó
              onSubmitSuccess={handleFormSubmitSuccess}
              onCancel={handleCloseForm}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}