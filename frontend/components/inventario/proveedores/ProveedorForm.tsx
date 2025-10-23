'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { ProveedorSchema, ProveedorFormData, Proveedor } from '@/lib/validators/proveedor';
import { createProveedor, updateProveedor } from '@/lib/api/proveedores';

interface ProveedorFormProps {
  initialData?: Proveedor | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function ProveedorForm({ initialData, onSubmitSuccess, onCancel }: ProveedorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const form = useForm<ProveedorFormData>({
    resolver: zodResolver(ProveedorSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      ruc: initialData?.ruc || '',
      telefono: initialData?.telefono || '',
    },
  });

  async function onSubmit(values: ProveedorFormData) {
    setIsLoading(true);
    setApiError(null);
    try {
      if (isEditing && initialData) {
        await updateProveedor(initialData.id, values);
      } else {
        await createProveedor(values);
      }
      onSubmitSuccess();
    } catch (error: unknown) {
      console.error("Error guardando proveedor:", error);
      let errorMessage = `Error al ${isEditing ? 'actualizar' : 'crear'} el proveedor.`;
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
                <Input placeholder="Nombre o Razón Social" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="ruc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RUC</FormLabel>
              <FormControl>
                <Input placeholder="Número de RUC (Opcional)" {...field} value={field.value ?? ''} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Número de contacto (Opcional)" {...field} value={field.value ?? ''} disabled={isLoading} />
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
            {isLoading ? "Guardando..." : (isEditing ? "Actualizar Proveedor" : "Crear Proveedor")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}