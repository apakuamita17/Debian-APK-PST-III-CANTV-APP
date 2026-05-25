// services/combustible.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatosConsumo, GeneradorElectrico } from '../types'; // CORREGIDO: importar interfaces
import { apiService } from './api.service';

export const combustibleService = {
  // Reutilización directa de la lógica del PST II
  calcularConsumo: (nivelAnterior: number, nivelActual: number, horas: number): number => {
    return (nivelAnterior - nivelActual) / horas;
  },
  
  // CORREGIDO: typo "Critique" → "Critico"
  generarAlerta: (nivel: number): string | null => {
    if (apiService.isNivelCritico(nivel)) { // CORREGIDO: nombre correcto
      return `¡ALERTA! Nivel crítico: ${nivel}%`;
    }
    return null;
  },
  
  async obtenerGeneradores(): Promise<GeneradorElectrico[]> { // CORREGIDO: tipado explícito
    try {
      return await apiService.getGeneradores();
    } catch (error) {
      console.warn('API no disponible, usando datos locales');
      const datosLocales = await AsyncStorage.getItem('generadores');
      if (datosLocales) {
        return JSON.parse(datosLocales);
      }
      return [
        { id: 1, modelo: 'Generador Principal', nivel_actual: 75, estado: 'activo', capacidad_tanque: 1000 },
        { id: 2, modelo: 'Generador Secundario', nivel_actual: 45, estado: 'activo', capacidad_tanque: 1000 },
        { id: 3, modelo: 'Generador Reserva', nivel_actual: 15, estado: 'alerta', capacidad_tanque: 1000 }
      ];
    }
  },
  
  async registrarNivel(idGenerador: number, nivel: number): Promise<DatosConsumo> { // CORREGIDO: tipado
    try {
      return await apiService.registrarNivel({ id_generador: idGenerador, nivel });
    } catch (error) {
      console.warn('API no disponible, guardando localmente');
      const nuevoDato: DatosConsumo = { // CORREGIDO: tipado explícito
        id: Date.now(),
        generador: idGenerador,
        nivel_actual: nivel,
        fecha: new Date().toISOString(),
        consumo: 0
      };
      
      const datosGuardados = await AsyncStorage.getItem('datosPendientes');
      const datosPendientes = datosGuardados ? JSON.parse(datosGuardados) : [];
      datosPendientes.push(nuevoDato);
      await AsyncStorage.setItem('datosPendientes', JSON.stringify(datosPendientes));
      
      return nuevoDato;
    }
  }
};