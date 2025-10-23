'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns, ServicioActionsProps } from '@/components/servicios/columns'; // Importar de servicios
import { Servicio } from '@/lib/validators/servicio';
import { getServicios, deleteServicio } from '@/lib/api/servicios'; // Importar API de servicios
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ServicioForm } from '@/components/servicios/ServicioForm'; // Importar Form de servicios
import { useToast } from '@/components/ui/use-toast';

export default function ServiciosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados diálogos
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingServicioId, setDeletingServicioId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) { router.replace('/login'); return; }
    // TODO: Verificar rol ADMIN
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getServicios();
      setServicios(data);
    } catch (err: unknown) {
      console.error("Error fetching servicios:", err);
      let errMsg = "Error desconocido.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      setError("No se pudieron cargar los servicios.");
      toast({ variant: "destructive", title: "Error Carga", description: errMsg });
    } finally { setIsLoading(false); }
  };

  // Handlers
  const handleOpenCreateForm = () => { setEditingServicio(null); setIsFormOpen(true); };
  const handleOpenEditForm = (s: Servicio) => { setEditingServicio(s); setIsFormOpen(true); };
  const handleOpenDeleteDialog = (s: Servicio) => { setDeletingServicioId(s.id); setIsDeleteDialogOpen(true); };
  const handleCloseForm = () => { setIsFormOpen(false); setEditingServicio(null); };
  const handleFormSubmitSuccess = () => {
    handleCloseForm();
    toast({ title: "Éxito", description: `Servicio ${editingServicio ? 'actualizado' : 'creado'}.` });
    fetchData();
  };
  const handleDeleteConfirm = async () => {
    if (!deletingServicioId) return;
    try {
      await deleteServicio(deletingServicioId);
      toast({ title: "Éxito", description: "Servicio eliminado." });
      fetchData();
    } catch (err: unknown) {
      console.error("Error deleting servicio:", err);
      let errMsg = "No se pudo eliminar.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      toast({ variant: "destructive", title: "Error Eliminar", description: errMsg });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingServicioId(null);
    }
  };

  const tableActions: ServicioActionsProps = {
    onEdit: handleOpenEditForm,
    onDelete: handleOpenDeleteDialog,
    servicio: {} as Servicio,
  };

  if (isLoading) return <div className="p-6">Cargando servicios...</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Servicios</h1>
        <Button onClick={handleOpenCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Servicio
        </Button>
      </div>

      <DataTable
        columns={columns(tableActions)}
        data={servicios}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
      />

      {/* --- Diálogo Crear/Editar --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingServicio ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
            <DialogDescription>Completa los detalles del servicio.</DialogDescription>
          </DialogHeader>
          {isFormOpen && (
             <ServicioForm
              initialData={editingServicio}
              onSubmitSuccess={handleFormSubmitSuccess}
              onCancel={handleCloseForm}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* --- Diálogo Eliminar --- */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Eliminar el servicio <span className='font-bold'>ID: {deletingServicioId}</span>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingServicioId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}