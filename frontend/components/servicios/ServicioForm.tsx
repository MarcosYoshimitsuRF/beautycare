'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { ServicioSchema, ServicioFormData, Servicio } from '@/lib/validators/servicio';
import { createServicio, updateServicio } from '@/lib/api/servicios';

interface ServicioFormProps {
  initialData?: Servicio | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function ServicioForm({ initialData, onSubmitSuccess, onCancel }: ServicioFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const form = useForm<ServicioFormData>({
    resolver: zodResolver(ServicioSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      // Convertir a string para el input, Zod lo convertirá de vuelta
      precio: initialData?.precio ?? 0,
      duracionMin: initialData?.duracionMin ?? 15, // Valor por defecto
    },
  });

  async function onSubmit(values: ServicioFormData) {
    setIsLoading(true);
    setApiError(null);
    try {
      if (isEditing && initialData) {
        await updateServicio(initialData.id, values);
      } else {
        await createServicio(values);
      }
      onSubmitSuccess();
    } catch (error: unknown) {
      console.error("Error guardando servicio:", error);
      let errorMessage = `Error al ${isEditing ? 'actualizar' : 'crear'} el servicio.`;
      if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
          errorMessage = error.message;
      }
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {apiError && <p className="text-sm text-destructive">{apiError}</p>}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del servicio" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-2 gap-4"> {/* Grid para precio y duración */}
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio *</FormLabel>
                  <FormControl>
                    {/* Input tipo number para mejor UX en móvil */}
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duracionMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración (min) *</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" min="1" placeholder="Ej. 30" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
         </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : (isEditing ? "Actualizar Servicio" : "Crear Servicio")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}