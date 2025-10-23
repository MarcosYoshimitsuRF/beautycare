'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
// Opcional: Usar Select si los métodos de pago son fijos
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PagoFormSchema, PagoFormData } from '@/lib/validators/pago';
import { createPago } from '@/lib/api/pagos';
import { useToast } from '../ui/use-toast';

interface PagoFormProps {
  // Opcional: Podríamos pre-rellenar citaId si el diálogo se abre desde una cita específica
  initialCitaId?: number | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function PagoForm({ initialCitaId, onSubmitSuccess, onCancel }: PagoFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<PagoFormData>({
    resolver: zodResolver(PagoFormSchema),
    defaultValues: {
      citaId: initialCitaId ?? undefined, // Pre-rellenar si viene
      monto: 0,
      metodo: '',
    },
  });

  async function onSubmit(values: PagoFormData) {
    setIsLoading(true);
    setApiError(null);
    console.log("Registrando pago:", values);
    try {
      await createPago(values);
      onSubmitSuccess(); // Cierra diálogo, muestra toast, recarga tabla
    } catch (error: unknown) {
      console.error("Error registrando pago:", error);
      let errorMessage = "Error al registrar el pago.";
      if (axios.isAxiosError(error) && error.response) {
          // Capturar error de pago duplicado del backend
          errorMessage = error.response.data?.message || `Error ${error.response.status}`;
      } else if (error instanceof Error) {
          errorMessage = error.message;
      }
      setApiError(errorMessage);
       toast({ variant: "destructive", title: "Error al Registrar", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{apiError}</p>}

        <FormField
          control={form.control}
          name="citaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID de la Cita a Pagar *</FormLabel>
              <FormControl>
                {/* Usamos Input type number, podría ser un Select si cargamos citas */}
                <Input
                    type="number"
                    placeholder="Ingrese el ID de la cita"
                    {...field}
                    // onChange={event => field.onChange(+event.target.value)} // Coerce to number
                    disabled={isLoading || !!initialCitaId} // Deshabilitar si viene pre-rellenado
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="monto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto Pagado (S/) *</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metodo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pago *</FormLabel>
              <FormControl>
                {/* Input simple, podría ser Select (Efectivo, Tarjeta, Yape, etc.) */}
                <Input placeholder="Ej. Efectivo, Tarjeta VISA" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar Pago"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}