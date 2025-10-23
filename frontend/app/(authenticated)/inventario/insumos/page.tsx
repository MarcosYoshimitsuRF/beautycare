'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns, InsumoActionsProps } from '@/components/inventario/insumos/columns'; // Importar de insumos
import { Insumo } from '@/lib/validators/insumo';
import { getInsumos, deleteInsumo } from '@/lib/api/insumos'; // Importar API de insumos
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
import { InsumoForm } from '@/components/inventario/insumos/InsumoForm'; // Importar Form de insumos
import { useToast } from '@/components/ui/use-toast';

export default function InsumosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados diálogos
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingInsumoId, setDeletingInsumoId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) { router.replace('/login'); return; }
    // TODO: Verificar rol ADMIN
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getInsumos();
      setInsumos(data);
    } catch (err: unknown) {
      console.error("Error fetching insumos:", err);
      let errMsg = "Error desconocido.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      setError("No se pudieron cargar los insumos.");
      toast({ variant: "destructive", title: "Error Carga", description: errMsg });
    } finally { setIsLoading(false); }
  };

  // Handlers
  const handleOpenCreateForm = () => { setEditingInsumo(null); setIsFormOpen(true); };
  const handleOpenEditForm = (i: Insumo) => { setEditingInsumo(i); setIsFormOpen(true); };
  const handleOpenDeleteDialog = (i: Insumo) => { setDeletingInsumoId(i.id); setIsDeleteDialogOpen(true); };
  const handleCloseForm = () => { setIsFormOpen(false); setEditingInsumo(null); };
  const handleFormSubmitSuccess = () => {
    handleCloseForm();
    toast({ title: "Éxito", description: `Insumo ${editingInsumo ? 'actualizado' : 'creado'}.` });
    fetchData();
  };
  const handleDeleteConfirm = async () => {
    if (!deletingInsumoId) return;
    try {
      await deleteInsumo(deletingInsumoId);
      toast({ title: "Éxito", description: "Insumo eliminado." });
      fetchData();
    } catch (err: unknown) {
      console.error("Error deleting insumo:", err);
      let errMsg = "No se pudo eliminar.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      toast({ variant: "destructive", title: "Error Eliminar", description: errMsg });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingInsumoId(null);
    }
  };

  const tableActions: InsumoActionsProps = {
    onEdit: handleOpenEditForm,
    onDelete: handleOpenDeleteDialog,
    insumo: {} as Insumo,
  };

  if (isLoading) return <div className="p-6">Cargando insumos...</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Insumos</h1>
        <Button onClick={handleOpenCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Insumo
        </Button>
      </div>

      <DataTable
        columns={columns(tableActions)}
        data={insumos}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
      />

      {/* --- Diálogo Crear/Editar --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingInsumo ? "Editar Insumo" : "Nuevo Insumo"}</DialogTitle>
            <DialogDescription>Completa los detalles del insumo.</DialogDescription>
          </DialogHeader>
          {isFormOpen && (
             <InsumoForm
              initialData={editingInsumo}
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
              Eliminar el insumo <span className='font-bold'>ID: {deletingInsumoId}</span>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingInsumoId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}