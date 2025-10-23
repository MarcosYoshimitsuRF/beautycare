'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form'; // Importar SubmitHandler
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// Importar Schema y TIPO
import { RegisterSchema, type RegisterFormData } from '@/lib/validators/auth';
// Importar la función API
import { registerUser } from '@/lib/api/auth';
// import { useToast } from "@/components/providers/ToastProvider";

export default function RegisterPage() {
  const router = useRouter();
  // const { toast } = useToast();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Inicializar useForm con el tipo correcto
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    mode: "onChange",
  });

  // Tipar onSubmit explícitamente con SubmitHandler
  const onSubmit: SubmitHandler<RegisterFormData> = async (values) => {
    setIsLoading(true);
    setApiError(null);
    console.log("Submit Registro:", values);
    try {
      const registeredUser = await registerUser(values); // Usar función API
      console.log("Usuario registrado:", registeredUser);
      console.log("Éxito", "¡Cuenta creada! Redirigiendo a login...");
      // toast({ title: "Éxito", description: "¡Cuenta creada! Ahora puedes iniciar sesión." });
      router.push('/login'); // Redirigir a login tras éxito
    } catch (error) {
       console.error("Error en el registro:", error);
       let errorMessage = "No se pudo completar el registro.";
       if (axios.isAxiosError(error) && error.response) {
         console.error("Detalles Error Backend (Register):", error.response.data);
         // Mostrar mensajes específicos del backend si existen
         errorMessage = error.response.data?.message || error.response.data?.messages?.join(', ') || `Error ${error.response.status}`;
       } else if (error instanceof Error) {
         errorMessage = error.message;
       }
       setApiError(errorMessage);
       console.error("Error de Registro", errorMessage);
       // toast({ variant: "destructive", title: "Error de Registro", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen /*...*/ p-4">
      <Card className="w-full max-w-sm shadow-lg">
       <CardHeader className="text-center">
         <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
         <CardDescription>Regístrate para agendar tus citas.</CardDescription>
       </CardHeader>
        <CardContent>
          <Form {...form}>
            {/* handleSubmit recibe la función onSubmit tipada */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control} // Tipo inferido de useForm<RegisterFormData>
                name="username"       // Clave válida de RegisterFormData
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario (Email recomendado)</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage /> {/* Error Zod para 'username' */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"       // Clave válida de RegisterFormData
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mínimo 6 caracteres" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage /> {/* Error Zod para 'password' */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword" // Clave válida de RegisterFormData
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Repite la contraseña" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage /> {/* Error Zod para 'confirmPassword' o el .refine */}
                  </FormItem>
                )}
              />
              {apiError && ( <p className="text-sm text-red-600"> {apiError} </p> )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? 'Registrando...' : 'Registrarme'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
           <p className="text-sm text-muted-foreground"> ¿Ya tienes cuenta?{' '} <Link href="/login" className="underline hover:text-primary"> Inicia Sesión </Link> </p>
        </CardFooter>
      </Card>
    </main>
  );
}