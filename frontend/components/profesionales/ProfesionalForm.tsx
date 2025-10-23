'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { ProfesionalSchema, ProfesionalFormData, Profesional } from '@/lib/validators/profesional';
import { createProfesional, updateProfesional } from '@/lib/api/profesionales'; // Importar API funcs

interface ProfesionalFormProps {
  initialData?: Profesional | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function ProfesionalForm({ initialData, onSubmitSuccess, onCancel }: ProfesionalFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const form = useForm<ProfesionalFormData>({
    resolver: zodResolver(ProfesionalSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      especialidad: initialData?.especialidad || '',
    },
  });

  async function onSubmit(values: ProfesionalFormData) {
    setIsLoading(true);
    setApiError(null);
    try {
      if (isEditing && initialData) {
        await updateProfesional(initialData.id, values); // Llamar API de update
      } else {
        await createProfesional(values); // Llamar API de create
      }
      onSubmitSuccess();
    } catch (error: unknown) {
      console.error("Error guardando profesional:", error);
      let errorMessage = `Error al ${isEditing ? 'actualizar' : 'crear'} el profesional.`;
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
                <Input placeholder="Nombre completo del profesional" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="especialidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialidad</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Estilista, Manicurista" {...field} value={field.value ?? ''} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : (isEditing ? "Actualizar Profesional" : "Crear Profesional")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}