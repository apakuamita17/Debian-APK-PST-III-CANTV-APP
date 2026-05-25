// services/api.service.ts
import { DatosConsumo, GeneradorElectrico } from '../types';

// URL base del backend del PST II (ajustar según tu entorno)
const BASE_URL = 'http://localhost:8000/api'; // Cambiar a la URL real del backend

export const apiService = {
  // Reutilización directa de los endpoints del PST II
  async getGeneradores(): Promise<GeneradorElectrico[]> {
    try {
      const response = await fetch(`${BASE_URL}/generadores/`);
      if (!response.ok) throw new Error('Error al obtener generadores');
      return await response.json();
    } catch (error) {
      console.error('Error en getGeneradores:', error);
      throw error;
    }
  },
  
  async registrarNivel(datos: { id_generador: number; nivel: number }): Promise<DatosConsumo> {
    try {
      const response = await fetch(`${BASE_URL}/consumos/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      });
      
      if (!response.ok) throw new Error('Error al registrar nivel');
      return await response.json();
    } catch (error) {
      console.error('Error en registrarNivel:', error);
      throw error;
    }
  },
  
  // Reutilización de la lógica de alertas del PST II
  isNivelCritico(nivel: number): boolean {
    // Regla exacta del PST II: "Alerta Crítica < 15%"
    return nivel < 15;
  }
};