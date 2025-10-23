'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/inventario/compras/columns'; // Importar columnas de compras
import { Compra } from '@/lib/validators/compra';
import { getCompras } from '@/lib/api/compras'; // Importar API de compras
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// No necesitamos AlertDialog ya que no hay delete
import { CompraRegisterForm } from '@/components/inventario/compras/CompraRegisterForm'; // Importar Form de compras
import { useToast } from '@/components/ui/use-toast';

export default function ComprasPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para diálogo de registro
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) { router.replace('/login'); return; }
    // TODO: Verificar rol ADMIN
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getCompras();
      setCompras(data);
    } catch (err: unknown) {
      console.error("Error fetching compras:", err);
      let errMsg = "Error desconocido.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      setError("No se pudieron cargar las compras.");
      toast({ variant: "destructive", title: "Error Carga", description: errMsg });
    } finally { setIsLoading(false); }
  };

  // Handlers
  const handleOpenRegisterForm = () => { setIsRegisterFormOpen(true); };
  const handleCloseRegisterForm = () => { setIsRegisterFormOpen(false); };
  const handleFormSubmitSuccess = () => {
    handleCloseRegisterForm();
    toast({ title: "Éxito", description: "Compra registrada y stock actualizado." });
    fetchData(); // Recargar tabla de compras (y stock de insumos implícitamente)
  };

  // No hay acciones Edit/Delete

  if (isLoading) return <div className="p-6">Cargando compras...</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Registro de Compras</h1>
        <Button onClick={handleOpenRegisterForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Registrar Nueva Compra
        </Button>
      </div>

      <DataTable
        columns={columns} // Columnas sin acciones
        data={compras}
        // No hay filtro de texto simple aquí, podríamos añadir filtros por fecha o proveedor si fuera necesario
        // filterColumnId="proveedorNombre"
        // filterPlaceholder="Filtrar..."
      />

      {/* --- Diálogo Registrar Compra --- */}
      <Dialog open={isRegisterFormOpen} onOpenChange={setIsRegisterFormOpen}>
        {/* Usar sm:max-w-[md] o lg para más espacio si es necesario */}
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Compra</DialogTitle>
            <DialogDescription>
              Completa los detalles de la compra para registrarla y reponer el stock del insumo.
            </DialogDescription>
          </DialogHeader>
          {/* Renderizar el formulario solo cuando está abierto */}
          {isRegisterFormOpen && (
             <CompraRegisterForm
              onSubmitSuccess={handleFormSubmitSuccess}
              onCancel={handleCloseRegisterForm}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* No hay diálogo de eliminación */}
    </div>
  );
}