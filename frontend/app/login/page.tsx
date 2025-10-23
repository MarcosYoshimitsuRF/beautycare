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
import { LoginSchema, type LoginFormData } from '@/lib/validators/auth';
import { axiosCore } from '@/lib/axiosConfig';

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Inicializar useForm con el tipo correcto
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: "onChange", // Validar mientras se escribe
  });

  // Tipar onSubmit explícitamente con SubmitHandler
  const onSubmit: SubmitHandler<LoginFormData> = async (values) => {
    setIsLoading(true);
    setLoginError(null);
    console.log("Submit Login:", values);
    try {
      const response = await axiosCore.post<{ token: string }>('/auth/login', values);
      if (response.data?.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('jwtToken', response.data.token);
          router.replace('/dashboard'); // Usar replace para no guardar login en historial
        }
      } else { setLoginError('Respuesta inesperada del servidor.'); }
    } catch (error) {
       console.error("Error en el login:", error);
       if (axios.isAxiosError(error) && error.response) {
         console.error("Detalles Error Backend (Login):", error.response.data);
         if (error.response.status === 401) { setLoginError('Credenciales inválidas.'); }
         else if (error.response.status === 400) { setLoginError(`Solicitud incorrecta: ${error.response.data?.messages?.join(', ') || 'Verifica los datos.'}`);}
         else { setLoginError(`Error ${error.response.status}: ${error.response.data?.message || 'Error en el servidor.'}`); }
       } else { setLoginError('No se pudo conectar con el servidor.'); }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">BeautyCare</CardTitle>
          <CardDescription>Bienvenido/a. Ingresa tus credenciales.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pasar la instancia 'form' correctamente tipada */}
          <Form {...form}>
            {/* handleSubmit recibe la función onSubmit tipada */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control} // El tipo 'control' viene de useForm<LoginFormData>
                name="username"       // Debe ser 'username', una clave válida de LoginFormData
                render={({ field }) => ( // 'field' tendrá el tipo correcto inferido
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="ej. admin" {...field} disabled={isLoading} autoComplete="username" />
                    </FormControl>
                    <FormMessage /> {/* Muestra errores de Zod para 'username' */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"       // Debe ser 'password', una clave válida de LoginFormData
                render={({ field }) => (
                   <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} autoComplete="current-password" />
                    </FormControl>
                    <FormMessage /> {/* Muestra errores de Zod para 'password' */}
                  </FormItem>
                )}
              />
              {loginError && ( <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md"> {loginError} </p> )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                 {/* ... icono de carga ... */}
                 {isLoading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
           <p className="text-sm text-muted-foreground"> ¿No tienes cuenta?{' '} <Link href="/register" className="underline hover:text-primary"> Regístrate </Link> </p>
        </CardFooter>
      </Card>
    </main>
  );
}