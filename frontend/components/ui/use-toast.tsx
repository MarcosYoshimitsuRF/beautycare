// *** CORRECCIÓN: Añadir la directiva "use client" ***
"use client";

import { createContext, useContext, ReactNode } from "react"; // Importar ReactNode

// Definir las opciones del toast
interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Definir el tipo del contexto
interface ToastContextType {
  toast: (options: ToastOptions) => void;
}

// Crear el contexto (puede ser null inicialmente)
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Props para el Provider
interface ToastProviderProps {
  children: ReactNode;
}

// El Provider que envuelve la aplicación
export const ToastProvider = ({ children }: ToastProviderProps) => {

  // La función toast (actualmente solo console.log)
  const toast = (options: ToastOptions) => {
    console.log("Toast:", options);
    // Aquí integrarías una librería visual si lo deseas, ej:
    // import { toast as hotToast } from 'react-hot-toast';
    // if (options.variant === 'destructive') {
    //   hotToast.error(options.description || options.title);
    // } else {
    //   hotToast.success(options.description || options.title);
    // }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Si usaras react-hot-toast, el Toaster visual iría aquí */}
      {/* <Toaster position="bottom-right" /> */}
    </ToastContext.Provider>
  );
};

// El hook para usar el toast en otros componentes
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    // Este error asegura que el hook se use dentro del Provider
    throw new Error("useToast debe ser usado dentro de un ToastProvider");
  }
  return context;
};

// --- EL CÓDIGO DE _app.tsx SE ELIMINA ---
// No pertenece a este archivo y no se usa en App Router.