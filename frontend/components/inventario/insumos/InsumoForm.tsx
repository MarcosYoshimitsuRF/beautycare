'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { InsumoSchema, InsumoFormData, Insumo } from '@/lib/validators/insumo';
import { createInsumo, updateInsumo } from '@/lib/api/insumos';

interface InsumoFormProps {
  initialData?: Insumo | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function InsumoForm({ initialData, onSubmitSuccess, onCancel }: InsumoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const form = useForm<InsumoFormData>({
    resolver: zodResolver(InsumoSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      stock: initialData?.stock ?? 0,
      stockMinimo: initialData?.stockMinimo ?? 0,
      unidad: initialData?.unidad || '',
    },
  });

  async function onSubmit(values: InsumoFormData) {
    setIsLoading(true);
    setApiError(null);
    try {
      if (isEditing && initialData) {
        await updateInsumo(initialData.id, values);
      } else {
        await createInsumo(values);
      }
      onSubmitSuccess();
    } catch (error: unknown) {
      console.error("Error guardando insumo:", error);
      let errorMessage = `Error al ${isEditing ? 'actualizar' : 'crear'} el insumo.`;
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
                <Input placeholder="Nombre del insumo" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Actual *</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" min="0" placeholder="0" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stockMinimo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Mínimo *</FormLabel>
                  <FormControl>
                     <Input type="number" step="1" min="0" placeholder="0" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
         </div>
         <FormField
          control={form.control}
          name="unidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidad</FormLabel>
              <FormControl>
                <Input placeholder="Ej. ml, gr, unidad" {...field} value={field.value ?? ''} disabled={isLoading} />
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
            {isLoading ? "Guardando..." : (isEditing ? "Actualizar Insumo" : "Crear Insumo")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}