'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import axios from 'axios'; // Importar axios para isAxiosError

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns, ClienteActionsProps } from '@/components/clientes/columns';
import { Cliente } from '@/lib/validators/cliente';
import { getClientes, createCliente, updateCliente, deleteCliente } from '@/lib/api/clientes';
// import { useToast } from "@/components/ui/use-toast"; // <-- ELIMINADO
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
import { ClienteForm } from '@/components/clientes/ClienteForm';
import { buttonVariants } from '@/components/ui/button'; // Importar buttonVariants si se usa en AlertDialogAction

export default function ClientesPage() {
  const router = useRouter();
  // const { toast } = useToast(); // <-- ELIMINADO
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los diálogos
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingClienteId, setDeletingClienteId] = useState<number | null>(null);

  // --- Protección básica y carga inicial ---
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    fetchData();
  }, [router]);

  // --- Función para cargar datos (con console.error en lugar de toast) ---
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err: unknown) {
      console.error("Error fetching clientes:", err);
      let errorMessage = "Error desconocido al cargar clientes.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || "Error de API al cargar clientes.";
        console.error("Detalles del error Axios:", err.response?.data);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError("No se pudieron cargar los clientes. Intente de nuevo.");
      // toast({ variant: "destructive", title: "Error de Carga", description: errorMessage }); // <-- ELIMINADO
      console.error("Error de Carga:", errorMessage); // Reemplazo temporal
      // alert(`Error de Carga: ${errorMessage}`); // Alternativa con alert
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers para Acciones ---
  const handleOpenCreateForm = () => {
    setEditingCliente(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (cliente: Cliente) => {
    setDeletingClienteId(cliente.id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCliente(null);
  };

  // --- Handler de Éxito del Formulario (con console.log en lugar de toast) ---
  const handleFormSubmitSuccess = () => {
    handleCloseForm();
    const successMessage = `Cliente ${editingCliente ? 'actualizado' : 'creado'} correctamente.`;
    // toast({ title: "Éxito", description: successMessage }); // <-- ELIMINADO
    console.log("Éxito:", successMessage); // Reemplazo temporal
    // alert(successMessage); // Alternativa con alert
    fetchData(); // Recargar la tabla
  };

  // --- Handler de Confirmar Borrado (con console.log/error en lugar de toast) ---
  const handleDeleteConfirm = async () => {
    if (!deletingClienteId) return;
    try {
      await deleteCliente(deletingClienteId);
      const successMessage = "Cliente eliminado correctamente.";
      // toast({ title: "Éxito", description: successMessage }); // <-- ELIMINADO
      console.log("Éxito:", successMessage); // Reemplazo temporal
      // alert(successMessage); // Alternativa con alert
      fetchData(); // Recargar la tabla
    } catch (err: unknown) {
      console.error("Error deleting cliente:", err);
      let errorMessage = "No se pudo eliminar el cliente.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || "Error de API al eliminar.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      // toast({ variant: "destructive", title: "Error al Eliminar", description: errorMessage }); // <-- ELIMINADO
      console.error("Error al Eliminar:", errorMessage); // Reemplazo temporal
      // alert(`Error al Eliminar: ${errorMessage}`); // Alternativa con alert
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingClienteId(null);
    }
  };

  // --- Props para las acciones en las columnas ---
  const tableActions: ClienteActionsProps = {
    onEdit: handleOpenEditForm,
    onDelete: handleOpenDeleteDialog,
    cliente: {} as Cliente, // Placeholder
  };

  // --- Renderizado ---
  if (isLoading) {
    return <div className="p-6">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="p-6 text-destructive">{error}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Clientes</h1>
        <Button onClick={handleOpenCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>

      <DataTable
        columns={columns(tableActions)}
        data={clientes}
        filterColumnId="nombre"
        filterPlaceholder="Filtrar por nombre..."
      />

      {/* --- Diálogo para Crear/Editar Cliente --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCliente ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
            <DialogDescription>
              {editingCliente ? "Modifica los datos del cliente." : "Completa los datos para crear un nuevo cliente."}
            </DialogDescription>
          </DialogHeader>
          {isFormOpen && (
             <ClienteForm
              initialData={editingCliente}
              onSubmitSuccess={handleFormSubmitSuccess}
              onCancel={handleCloseForm}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* --- Diálogo de Confirmación para Eliminar --- */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente al cliente
              <span className='font-bold'> ID: {deletingClienteId} </span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingClienteId(null)}>Cancelar</AlertDialogCancel>
            {/* Asegúrate que buttonVariants esté importado si usas esta clase */}
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}