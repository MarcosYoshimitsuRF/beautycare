'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';

import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns, ProfesionalActionsProps } from '@/components/profesionales/columns';
import { Profesional } from '@/lib/validators/profesional';
import { getProfesionales, deleteProfesional } from '@/lib/api/profesionales'; // Importar API funcs
// Asegúrate que la ruta a tu useToast sea correcta
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
import { ProfesionalForm } from '@/components/profesionales/ProfesionalForm'; // Importar Form
import { useToast } from '@/components/ui/use-toast';

export default function ProfesionalesPage() {
  const router = useRouter();
  const { toast } = useToast(); // Usar tu hook
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para diálogos
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfesional, setEditingProfesional] = useState<Profesional | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingProfesionalId, setDeletingProfesionalId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    // TODO: Verificar rol ADMIN aquí antes de cargar datos
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProfesionales();
      setProfesionales(data);
    } catch (err: unknown) {
      console.error("Error fetching profesionales:", err);
      let errorMessage = "Error desconocido.";
      if (axios.isAxiosError(err)) errorMessage = err.response?.data?.message || err.message;
      else if (err instanceof Error) errorMessage = err.message;
      setError("No se pudieron cargar los profesionales.");
      toast({ variant: "destructive", title: "Error de Carga", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---
  const handleOpenCreateForm = () => { setEditingProfesional(null); setIsFormOpen(true); };
  const handleOpenEditForm = (p: Profesional) => { setEditingProfesional(p); setIsFormOpen(true); };
  const handleOpenDeleteDialog = (p: Profesional) => { setDeletingProfesionalId(p.id); setIsDeleteDialogOpen(true); };
  const handleCloseForm = () => { setIsFormOpen(false); setEditingProfesional(null); };
  const handleFormSubmitSuccess = () => {
    handleCloseForm();
    toast({ title: "Éxito", description: `Profesional ${editingProfesional ? 'actualizado' : 'creado'}.` });
    fetchData();
  };
  const handleDeleteConfirm = async () => {
    if (!deletingProfesionalId) return;
    try {
      await deleteProfesional(deletingProfesionalId);
      toast({ title: "Éxito", description: "Profesional eliminado." });
      fetchData();
    } catch (err: unknown) {
      console.error("Error deleting profesional:", err);
      let errorMessage = "No se pudo eliminar.";
      if (axios.isAxiosError(err)) errorMessage = err.response?.data?.message || err.message;
      else if (err instanceof Error) errorMessage = err.message;
      toast({ variant: "destructive", title: "Error al Eliminar", description: errorMessage });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingProfesionalId(null);
    }
  };

  // --- Props para las columnas ---
  const tableActions: ProfesionalActionsProps = {
    onEdit: handleOpenEditForm,
    onDelete: handleOpenDeleteDialog,
    profesional: {} as Profesional,
  };

  if (isLoading) return <div className="p-6">Cargando profesionales...</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;

  return (
    <div className="p-6 space-y-4"> {/* Mismo padding que el main layout */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Profesionales</h1>
        <Button onClick={handleOpenCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Profesional
        </Button>
      </div>

      <DataTable
        columns={columns(tableActions)}
        data={profesionales}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
      />

      {/* --- Diálogo Crear/Editar --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProfesional ? "Editar Profesional" : "Nuevo Profesional"}</DialogTitle>
            <DialogDescription>
              {editingProfesional ? "Modifica los datos." : "Completa los datos."}
            </DialogDescription>
          </DialogHeader>
          {isFormOpen && (
             <ProfesionalForm
              initialData={editingProfesional}
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
              Eliminar al profesional <span className='font-bold'>ID: {deletingProfesionalId}</span>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingProfesionalId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}