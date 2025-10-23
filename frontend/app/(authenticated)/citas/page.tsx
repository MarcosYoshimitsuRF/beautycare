'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns'; // Make sure this is imported
import { es } from 'date-fns/locale'; // Make sure this is imported

import { Button, buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns, CitaActionsProps } from '@/components/citas/columns';
import { Cita } from '@/lib/validators/cita';
import { getCitas, updateCitaEstado } from '@/lib/api/citas';
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
import { CitaForm } from '@/components/citas/CitaForm';
import { useToast } from '@/components/ui/use-toast';

// --- PLACEHOLDER ---
// TODO: Replace this with actual logic to get the logged-in user's ID
// This might involve:
// 1. Creating an authentication context/provider.
// 2. Decoding the JWT (less secure on client-side) after login.
// 3. Fetching user details from a backend endpoint like /api/me.
const MOCK_CLIENTE_ID = 1;
// --- END PLACEHOLDER ---

// Helper function (if not already defined globally or imported)
const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try { return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es }); }
    catch { return dateString; }
};


export default function CitasPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para diálogos
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelingCita, setCancelingCita] = useState<Cita | null>(null);

  // Estado para el ID del cliente logueado
  const [clienteId, setClienteId] = useState<number | null>(null); // Start as null
  // const [userRoles, setUserRoles] = useState<string[]>([]); // Estado para roles (opcional ahora)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    // *** SIMULATE GETTING USER ID ***
    // Replace this simulation with your actual authentication logic
    console.log("Simulating getting user info...");
    // Example: Decode token (requires jwt-decode library)
    // try {
    //   const decoded: { sub: string, roles: string[], /* other claims */ } = jwtDecode(token);
    //   // Assuming your backend puts client ID in a claim, or you fetch it based on 'sub' (username)
    //   const fetchedClientId = MOCK_CLIENTE_ID; // Replace with actual logic
    //   setClienteId(fetchedClientId);
    //   setUserRoles(decoded.roles || []);
    //   console.log("User ID set:", fetchedClientId);
    // } catch (e) {
    //   console.error("Invalid token:", e);
    //   localStorage.removeItem('jwtToken');
    //   router.replace('/login');
    //   return;
    // }
    // --- Using Mock ID for now ---
    setClienteId(MOCK_CLIENTE_ID);
    console.log("Using Mock User ID:", MOCK_CLIENTE_ID);
    // --- End Simulation ---

    fetchData();
  // Only run once on mount, router dependency is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCitas();
      // TODO: Implement filtering based on user role and clienteId if needed
      // const isAdminOrStaff = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_STAFF');
      // const filteredData = isAdminOrStaff ? data : data.filter(c => c.cliente?.id === clienteId);
      // setCitas(filteredData);
      setCitas(data); // Display all for now
    } catch (err: unknown) {
      console.error("Error fetching citas:", err);
      let errMsg = "Error desconocido al cargar citas.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      setError("No se pudieron cargar las citas.");
      toast({ variant: "destructive", title: "Error Carga", description: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---
  const handleOpenCreateForm = () => { setIsFormOpen(true); };
  const handleCloseForm = () => { setIsFormOpen(false); };
  const handleFormSubmitSuccess = () => {
    handleCloseForm();
    toast({ title: "Éxito", description: "Cita agendada correctamente." });
    fetchData();
  };
  const handleOpenCancelDialog = (c: Cita) => {
     setCancelingCita(c);
     setIsCancelDialogOpen(true);
  };
  const handleCancelConfirm = async () => {
    if (!cancelingCita) return;
    try {
      await updateCitaEstado(cancelingCita.id, "CANCELADA");
      toast({ title: "Éxito", description: "Cita cancelada." });
      fetchData();
    } catch (err: unknown) {
      console.error("Error canceling cita:", err);
      let errMsg = "No se pudo cancelar la cita.";
      if (axios.isAxiosError(err)) errMsg = err.response?.data?.message || err.message;
      else if (err instanceof Error) errMsg = err.message;
      toast({ variant: "destructive", title: "Error al Cancelar", description: errMsg });
    } finally {
      setIsCancelDialogOpen(false);
      setCancelingCita(null);
    }
  };

  // --- Props for Table Actions ---
  const tableActions: CitaActionsProps = {
    onCancel: handleOpenCancelDialog,
    cita: {} as Cita, // Placeholder needed for type, value ignored by columns definition
  };

  // --- Render Logic ---
  if (isLoading && clienteId === null) { // Show loading only if client ID hasn't been determined yet
     return <div className="p-6">Verificando usuario...</div>; // Initial auth check
  }

  if (isLoading) return <div className="p-6">Cargando citas...</div>; // Loading appointments data
  if (error) return <div className="p-6 text-destructive">{error}</div>; // Error fetching appointments

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Mis Citas</h1>
        {/* Only show button if we have a valid client ID */}
        {clienteId !== null && (
            <Button onClick={handleOpenCreateForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> Agendar Nueva Cita
            </Button>
        )}
      </div>

      <DataTable
        columns={columns(tableActions)}
        data={citas} // Use 'citas' directly for now, filtering applied above if needed
        // filterColumnId="estado" // Example filter possibility
        // filterPlaceholder="Filtrar por estado..."
      />

      {/* --- Agendar Cita Dialog --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
             <DialogTitle>Agendar Nueva Cita</DialogTitle>
             <DialogDescription>Selecciona servicio, profesional y horario.</DialogDescription>
          </DialogHeader>
          {/* Ensure form only renders when open AND client ID is available */}
          {isFormOpen && clienteId !== null ? (
             <CitaForm
              clienteIdLogueado={clienteId} // Pass the determined client ID
              onSubmitSuccess={handleFormSubmitSuccess}
              onCancel={handleCloseForm}
            />
          ) : (
             // Show error within dialog if client ID is missing when trying to open
             isFormOpen && <p className='text-red-600 p-4'>Error: No se pudo identificar al cliente para agendar.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* --- Cancelar Cita Dialog --- */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
         <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar Cancelación?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cancelar la cita del{' '}
              <span className='font-semibold'>{formatDateTime(cancelingCita?.fechaHoraInicio)}</span>
              {' '}con <span className='font-semibold'>{cancelingCita?.profesional?.nombre}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelingCita(null)}>No, mantener</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm} className={buttonVariants({ variant: "destructive" })}>
              Sí, cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}