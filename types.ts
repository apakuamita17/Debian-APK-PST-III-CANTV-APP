// types.ts
export interface GeneradorElectrico {
  id: number;
  modelo: string;
  capacidad_tanque: number;
  nivel_actual: number;
  estado: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  coordenadas_gps?: string;
}

export interface DatosConsumo {
  id: number;
  generador: number;
  fecha: string;
  consumo: number;
  nivel_actual: number;
}

export interface Combustible {
  id: number;
  tipo: string;
  cantidad_disponible: number;
  nivel_critico: number;
  ultima_sincronizacion?: string;
}