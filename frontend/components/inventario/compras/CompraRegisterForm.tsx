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
import { CompraRegisterSchema, CompraRegisterFormData } from '@/lib/validators/compra';
import { registerCompra } from '@/lib/api/compras';
import { getProveedores } from '@/lib/api/proveedores';
import { getInsumos } from '@/lib/api/insumos';
import { Proveedor } from '@/lib/validators/proveedor';
import { Insumo } from '@/lib/validators/insumo';
import { useToast } from '@/components/ui/use-toast';

interface CompraRegisterFormProps {
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function CompraRegisterForm({ onSubmitSuccess, onCancel }: CompraRegisterFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true); // Estado para carga de selects

  useEffect(() => {
    const loadDropdownData = async () => {
      setIsLoadingDropdowns(true);
      try {
        const [provData, insData] = await Promise.all([getProveedores(), getInsumos()]);
        setProveedores(provData);
        setInsumos(insData);
      } catch (error) {
        console.error("Error loading dropdown data:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar proveedores/insumos." });
      } finally {
        setIsLoadingDropdowns(false);
      }
    };
    loadDropdownData();
  }, [toast]);

  const form = useForm<CompraRegisterFormData>({
    resolver: zodResolver(CompraRegisterSchema),
    defaultValues: {
      proveedorId: undefined,
      fecha: new Date(),
      total: 0,
      insumoIdParaReponer: undefined,
      cantidadRepuesta: 1,
    },
  });

  async function onSubmit(values: CompraRegisterFormData) {
    setIsLoading(true);
    setApiError(null);
    try {
      await registerCompra(values);
      onSubmitSuccess();
    } catch (error: unknown) {
      console.error("Error registrando compra:", error);
      let errorMessage = "Error al registrar la compra.";
      if (axios.isAxiosError(error)) errorMessage = error.response?.data?.message || error.message || errorMessage;
      else if (error instanceof Error) errorMessage = error.message;
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        {apiError && <p className="text-sm text-destructive">{apiError}</p>}

        {/* Select Proveedor */}
        <FormField
          control={form.control}
          name="proveedorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor *</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={isLoading || isLoadingDropdowns} // Deshabilitar mientras carga
              >
                <FormControl>
                  <SelectTrigger>
                    {/* El placeholder se muestra si field.value es undefined */}
                    <SelectValue placeholder={isLoadingDropdowns ? "Cargando proveedores..." : "Selecciona un proveedor"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Renderizar items solo si no está cargando y hay datos */}
                  {!isLoadingDropdowns && proveedores.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.nombre} {p.ruc ? `(${p.ruc})` : ''}
                    </SelectItem>
                  ))}
                  {/* Mensaje si no hay proveedores después de cargar */}
                  {!isLoadingDropdowns && proveedores.length === 0 && (
                     <div className="px-2 py-1.5 text-sm text-muted-foreground">No hay proveedores.</div>
                  )}
                  {/* EL SELECTITEM CON VALUE="" SE ELIMINÓ */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha */}
         <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de Compra *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: es }) // Format date nicely
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01") || isLoading
                    }
                    initialFocus
                    locale={es} // Use Spanish locale
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total Compra */}
        <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Compra (S/) *</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-lg font-semibold pt-4 border-t">Detalle de Reposición</h3>
         {/* Select Insumo a Reponer */}
         <FormField
          control={form.control}
          name="insumoIdParaReponer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insumo a Reponer *</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
                disabled={isLoading || isLoadingDropdowns} // Deshabilitar mientras carga
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingDropdowns ? "Cargando insumos..." : "Selecciona un insumo"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!isLoadingDropdowns && insumos.map((i) => (
                    <SelectItem key={i.id} value={i.id.toString()}>
                      {i.nombre} ({i.stock} {i.unidad || ''} en stock)
                    </SelectItem>
                  ))}
                  {!isLoadingDropdowns && insumos.length === 0 && (
                     <div className="px-2 py-1.5 text-sm text-muted-foreground">No hay insumos.</div>
                  )}
                  {/* EL SELECTITEM CON VALUE="" SE ELIMINÓ */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cantidad Repuesta */}
        <FormField
          control={form.control}
          name="cantidadRepuesta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad Comprada/Repuesta *</FormLabel>
              <FormControl>
                 <Input type="number" step="1" min="1" placeholder="1" {...field} disabled={isLoading} />
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
            {isLoading ? "Registrando..." : "Registrar Compra y Reponer Stock"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}