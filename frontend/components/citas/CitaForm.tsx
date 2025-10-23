'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CitaFormSchema, CitaFormData } from '@/lib/validators/cita';
import { createCita } from '@/lib/api/citas';
import { getProfesionales } from '@/lib/api/profesionales'; // Asegurar importación correcta
import { getServicios } from '@/lib/api/servicios';       // Asegurar importación correcta
import { Profesional } from '@/lib/validators/profesional';
import { Servicio } from '@/lib/validators/servicio';
import { useToast } from '../ui/use-toast';

interface CitaFormProps {
  clienteIdLogueado: number;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function CitaForm({ clienteIdLogueado, onSubmitSuccess, onCancel }: CitaFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);
  const [selectedTime, setSelectedTime] = useState<string>("09:00"); // Hora inicial por defecto

  // Cargar datos para selects (revisado)
  useEffect(() => {
    let isMounted = true; // Flag para evitar updates si el componente se desmonta
    const loadDropdownData = async () => {
      console.log("CitaForm: Cargando datos para selects..."); // Log para depuración
      setIsLoadingDropdowns(true);
      try {
        // Llamadas en paralelo
        const [profData, servData] = await Promise.all([
          getProfesionales(),
          getServicios()
        ]);
        if (isMounted) { // Solo actualizar estado si el componente sigue montado
          console.log("CitaForm: Datos cargados:", { profData, servData });
          setProfesionales(profData);
          setServicios(servData);
        }
      } catch (error) {
        console.error("CitaForm: Error loading dropdown data:", error);
        if (isMounted) {
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar opciones." });
        }
      } finally {
        if (isMounted) {
          setIsLoadingDropdowns(false);
        }
      }
    };
    loadDropdownData();

    // Función de limpieza para cancelar updates si se desmonta
    return () => { isMounted = false; };
  }, [toast]); // useEffect se ejecuta una vez al montar

  const form = useForm<CitaFormData>({
    resolver: zodResolver(CitaFormSchema),
    defaultValues: {
      clienteId: clienteIdLogueado,
      profesionalId: undefined,
      servicioId: undefined,
      fechaHoraInicio: undefined,
    },
    mode: "onChange",
  });

  async function onSubmit(values: CitaFormData) {
    setIsLoading(true);
    setApiError(null);

    const [hours, minutes] = selectedTime.split(':').map(Number);
    if (values.fechaHoraInicio instanceof Date && !isNaN(values.fechaHoraInicio.valueOf())) {
        const fechaConHora = new Date(values.fechaHoraInicio.getTime());
        fechaConHora.setHours(hours, minutes, 0, 0);
        values.fechaHoraInicio = fechaConHora;
    } else {
        form.setError("fechaHoraInicio", { type: "manual", message: "Selecciona fecha válida." });
        setApiError("Selecciona fecha válida.");
        setIsLoading(false);
        return;
    }

    console.log("Agendando cita:", values);
    try {
      await createCita(values);
      onSubmitSuccess();
    } catch (error: unknown) {
      console.error("Error agendando cita:", error);
      let errorMessage = "Error al agendar la cita.";
       if (axios.isAxiosError(error) && error.response) { errorMessage = error.response.data?.message || `Error ${error.response.status}`; }
       else if (error instanceof Error) { errorMessage = error.message; }
      setApiError(errorMessage);
       toast({ variant: "destructive", title: "Error al Agendar", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      {/* Añadir p-4 al DialogContent o ajustar max-h/overflow aquí */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-3"> {/* Añadido pr-3 para scrollbar */}
        {apiError && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{apiError}</p>}

        {/* Select Servicio */}
        <FormField control={form.control} name="servicioId" render={({ field }) => (
            <FormItem>
              <FormLabel>Servicio *</FormLabel>
              <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()} disabled={isLoading || isLoadingDropdowns}>
                <FormControl><SelectTrigger><SelectValue placeholder={isLoadingDropdowns ? "Cargando..." : "Selecciona un servicio"} /></SelectTrigger></FormControl>
                <SelectContent>
                   {!isLoadingDropdowns && servicios.length > 0 && servicios.map((s) => ( <SelectItem key={s.id} value={s.id.toString()}>{s.nombre} ({s.duracionMin} min)</SelectItem> ))}
                   {!isLoadingDropdowns && servicios.length === 0 && <div className="px-2 py-1.5 text-sm text-muted-foreground">No hay servicios disponibles.</div>}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
         )} />

        {/* Select Profesional */}
        <FormField control={form.control} name="profesionalId" render={({ field }) => (
            <FormItem>
              <FormLabel>Profesional *</FormLabel>
              <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value?.toString()} disabled={isLoading || isLoadingDropdowns}>
                 <FormControl><SelectTrigger><SelectValue placeholder={isLoadingDropdowns ? "Cargando..." : "Selecciona un profesional"} /></SelectTrigger></FormControl>
                <SelectContent>
                   {!isLoadingDropdowns && profesionales.length > 0 && profesionales.map((p) => ( <SelectItem key={p.id} value={p.id.toString()}>{p.nombre} {p.especialidad ? `(${p.especialidad})` : ''}</SelectItem> ))}
                   {!isLoadingDropdowns && profesionales.length === 0 && <div className="px-2 py-1.5 text-sm text-muted-foreground">No hay profesionales disponibles.</div>}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
         )} />

         {/* Selector Fecha y Hora */}
         <div className="grid grid-cols-2 gap-4 items-end">
            <FormField control={form.control} name="fechaHoraInicio" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal justify-start", !field.value && "text-muted-foreground")} disabled={isLoading}>
                          {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value instanceof Date && !isNaN(field.value.valueOf()) ? field.value : undefined} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().toDateString()) || isLoading } initialFocus locale={es} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
             )} />
            <FormItem>
                 <FormLabel>Hora *</FormLabel>
                 <FormControl>
                    <Input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} disabled={isLoading} step="1800" />
                 </FormControl>
             </FormItem>
         </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
          {/* Deshabilitar submit si los selects no han cargado */}
          <Button type="submit" disabled={isLoading || isLoadingDropdowns}>
            {isLoading ? "Agendando..." : "Confirmar Cita"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}