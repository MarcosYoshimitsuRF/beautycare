'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns, ProveedorActionsProps } from '@/components/inventario/proveedores/columns'; // Importar de proveedores
import { Proveedor } from '@/lib/validators/proveedor';
import { getProveedores, deleteProveedor } from '@/lib/api/proveedores'; // Importar API de proveedores
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
import { ProveedorForm } from '@/components/inventario/proveedores/ProveedorForm'; // Importar Form de proveedores
import { useToast } from '@/components/ui/use-toast';

export default function ProveedoresPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados diálogos
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProveedorId, setDeletingProveedorId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) { router.replace('/login'); return; }
    // TODO: Verificar rol ADMIN
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (err: unknown) {
      console.error("Error fetching proveedores:", err);
      let errMsg = "Error desconocido.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      setError("No se pudieron cargar los proveedores.");
      toast({ variant: "destructive", title: "Error Carga", description: errMsg });
    } finally { setIsLoading(false); }
  };

  // Handlers
  const handleOpenCreateForm = () => { setEditingProveedor(null); setIsFormOpen(true); };
  const handleOpenEditForm = (p: Proveedor) => { setEditingProveedor(p); setIsFormOpen(true); };
  const handleOpenDeleteDialog = (p: Proveedor) => { setDeletingProveedorId(p.id); setIsDeleteDialogOpen(true); };
  const handleCloseForm = () => { setIsFormOpen(false); setEditingProveedor(null); };
  const handleFormSubmitSuccess = () => {
    handleCloseForm();
    toast({ title: "Éxito", description: `Proveedor ${editingProveedor ? 'actualizado' : 'creado'}.` });
    fetchData();
  };
  const handleDeleteConfirm = async () => {
    if (!deletingProveedorId) return;
    try {
      await deleteProveedor(deletingProveedorId);
      toast({ title: "Éxito", description: "Proveedor eliminado." });
      fetchData();
    } catch (err: unknown) {
      console.error("Error deleting proveedor:", err);
      let errMsg = "No se pudo eliminar.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      toast({ variant: "destructive", title: "Error Eliminar", description: errMsg });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingProveedorId(null);
    }
  };

  const tableActions: ProveedorActionsProps = {
    onEdit: handleOpenEditForm,
    onDelete: handleOpenDeleteDialog,
    proveedor: {} as Proveedor,
  };

  if (isLoading) return <div className="p-6">Cargando proveedores...</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Proveedores</h1>
        <Button onClick={handleOpenCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Proveedor
        </Button>
      </div>

      <DataTable
        columns={columns(tableActions)}
        data={proveedores}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
      />

      {/* --- Diálogo Crear/Editar --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
            <DialogDescription>Completa los detalles del proveedor.</DialogDescription>
          </DialogHeader>
          {isFormOpen && (
             <ProveedorForm
              initialData={editingProveedor}
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
              Eliminar al proveedor <span className='font-bold'>ID: {deletingProveedorId}</span>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingProveedorId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}