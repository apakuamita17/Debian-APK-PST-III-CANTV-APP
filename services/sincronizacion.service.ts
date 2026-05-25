// services/sincronizacion.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatosConsumo } from '../types'; // AGREGADO: importar interfaz
import { apiService } from './api.service';

export const sincronizacionService = {
  async registrarNivelOffline(idGenerador: number, nivel: number) {
    const timestampLocal = new Date().toISOString();
    const datoOffline: DatosConsumo = { // CORREGIDO: tipado explícito
      id: Date.now(),
      generador: idGenerador,
      nivel_actual: nivel,
      fecha: timestampLocal,
      consumo: 0
    };
    
    const datosGuardados = await AsyncStorage.getItem('datosPendientes');
    const datosPendientes: DatosConsumo[] = datosGuardados ? JSON.parse(datosGuardados) : []; // CORREGIDO
    datosPendientes.push(datoOffline);
    
    await AsyncStorage.setItem('datosPendientes', JSON.stringify(datosPendientes));
    return datoOffline;
  },

  async sincronizarPendientes() {
    const datosPendientesStr = await AsyncStorage.getItem('datosPendientes');
    if (!datosPendientesStr) return { exitosos: 0, fallidos: 0 };
    
    const pendientes: DatosConsumo[] = JSON.parse(datosPendientesStr); // CORREGIDO: tipado
    const exitosos: DatosConsumo[] = []; // CORREGIDO: tipado explícito
    const fallidos: DatosConsumo[] = []; // CORREGIDO: tipado explícito
    
    for (const dato of pendientes) {
      try {
        await apiService.registrarNivel({
          id_generador: dato.generador,
          nivel: dato.nivel_actual
        });
        exitosos.push(dato);
      } catch (error) {
        console.error('Error sincronizando dato:', error);
        fallidos.push(dato);
      }
    }
    
    const nuevosPendientes = pendientes.filter(d => !exitosos.includes(d));
    await AsyncStorage.setItem('datosPendientes', JSON.stringify(nuevosPendientes));
    
    return { exitosos: exitosos.length, fallidos: fallidos.length };
  }
};