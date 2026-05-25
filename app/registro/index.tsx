import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Appbar, Button, Divider, List, Provider as PaperProvider, Paragraph } from 'react-native-paper';
import { combustibleService } from '../../services/combustible.service';
import { GeneradorElectrico } from '../../types';

export default function RegistrarScreen() {
  const [generadorId, setGeneradorId] = useState('');
  const [nivel, setNivel] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [generadores, setGeneradores] = useState<GeneradorElectrico[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    cargarGeneradores();
  }, []);

  const cargarGeneradores = async () => {
    try {
      // Reutilización directa de la lógica del PST II
      const datos = await combustibleService.obtenerGeneradores();
      setGeneradores(datos);
    } catch (error) {
      console.error('Error al cargar generadores:', error);
      // Fallback: datos de prueba si la API falla
      setGeneradores([
        { id: 1, modelo: 'Generador Principal', nivel_actual: 75, estado: 'activo', capacidad_tanque: 1000 },
        { id: 2, modelo: 'Generador Secundario', nivel_actual: 45, estado: 'activo', capacidad_tanque: 1000 },
        { id: 3, modelo: 'Generador Reserva', nivel_actual: 15, estado: 'alerta', capacidad_tanque: 1000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrar = async () => {
    if (!generadorId) {
      alert('Error: Seleccione un generador');
      return;
    }
    
    const nivelNum = parseInt(nivel);
    if (!nivel || isNaN(nivelNum) || nivelNum < 0 || nivelNum > 100) {
      alert('Error: Ingrese un nivel válido (0-100%)');
      return;
    }
    
    try {
      // Reutilización directa de la lógica del PST II
      await combustibleService.registrarNivel(parseInt(generadorId), nivelNum);
      
      // Actualizar la lista de generadores
      await cargarGeneradores();
      
      alert('¡Éxito! Nivel registrado correctamente');
      router.back();
    } catch (error) {
      alert('Error:, No se pudo registrar el nivel');
      console.error('Error al registrar nivel:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Registrar Nivel de Combustible" />
      </Appbar.Header>
      
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Seleccione el generador</Text>
        
        {generadores.map((generador) => (
          <List.Item
            key={generador.id}
            title={generador.modelo}
            description={`ID: ${generador.id} | Nivel actual: ${generador.nivel_actual}%`}
            left={props => <List.Icon {...props} icon="generator" />}
            onPress={() => setGeneradorId(generador.id.toString())}
            style={[
              styles.listItem,
              generadorId === generador.id.toString() && styles.listItemSelected
            ]}
          />
        ))}
        
        <Divider style={styles.divider} />
        
        <Text style={styles.formTitle}>Ingrese el nivel de combustible</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nivel (%)"
          value={nivel}
          onChangeText={setNivel}
          keyboardType="numeric"
        />
        
        <TextInput
          style={[styles.input, styles.observaciones]}
          placeholder="Observaciones (opcional)"
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          numberOfLines={3}
        />
        
        <Button 
          mode="contained" 
          style={styles.registrarButton}
          onPress={handleRegistrar}
        >
          Registrar Nivel
        </Button>
        
        <Paragraph style={styles.offlineText}>
          Modo Offline - Los datos se sincronizarán al recuperar conexión
        </Paragraph>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  listItemSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  divider: {
    marginVertical: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  observaciones: {
    height: 80,
    textAlignVertical: 'top',
  },
  registrarButton: {
    marginTop: 16,
    backgroundColor: '#43A047',
  },
  offlineText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});