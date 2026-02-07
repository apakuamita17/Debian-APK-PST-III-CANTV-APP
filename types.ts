// types.ts
export interface Generador {
    id: string;
    nombre: string;
    nivel: number;
    estado: string;
    ubicacion: string;
  }
  
  export interface Alerta {
    id: string;
    titulo: string;
    mensaje: string;
    generador: string;
    fecha: string;
  }