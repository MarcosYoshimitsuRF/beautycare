'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import axios from 'axios'; // Importar axios para isAxiosError

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { ClienteSchema, ClienteFormData, Cliente } from '@/lib/validators/cliente';
// *** PASO 1: Importar las funciones de API ***
import { createCliente, updateCliente } from '@/lib/api/clientes';

interface ClienteFormProps {
  initialData?: Cliente | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function ClienteForm({ initialData, onSubmitSuccess, onCancel }: ClienteFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(ClienteSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      celular: initialData?.celular || '',
      email: initialData?.email || '',
      // No incluimos el ID aquí, se maneja fuera del form data
    },
  });

  async function onSubmit(values: ClienteFormData) {
    setIsLoading(true);
    setApiError(null);
    try {
      if (isEditing && initialData) {
        // *** PASO 2: Llamar a updateCliente ***
        await updateCliente(initialData.id, values);
        console.log("Cliente actualizado:", initialData.id, values);
      } else {
        // *** PASO 3: Llamar a createCliente ***
        await createCliente(values);
        console.log("Cliente creado:", values);
      }
      onSubmitSuccess(); // Llama al callback si la API fue exitosa
    } catch (error: unknown) { // Manejo de error con unknown
      console.error("Error guardando cliente:", error);
      let errorMessage = `Error al ${isEditing ? 'actualizar' : 'crear'} el cliente.`;
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
        {/* Mostrar error de API si existe */}
        {apiError && (
          <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
            {apiError}
          </p>
        )}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo del cliente" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="celular"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                {/* Aseguramos que el valor sea string o undefined */}
                <Input placeholder="Número de celular" {...field} value={field.value ?? ''} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                 {/* Aseguramos que el valor sea string o undefined */}
                <Input type="email" placeholder="correo@ejemplo.com" {...field} value={field.value ?? ''} disabled={isLoading} />
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
             {/* Icono de carga opcional */}
             {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? "Guardando..." : (isEditing ? "Actualizar Cliente" : "Crear Cliente")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}