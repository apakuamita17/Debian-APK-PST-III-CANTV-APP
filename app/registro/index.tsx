import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Appbar, Button, Divider, List, Provider as PaperProvider, Paragraph } from 'react-native-paper';
import { Generador } from '../../types';

export default function RegistrarScreen() {
  const [generadorId, setGeneradorId] = useState('');
  const [nivel, setNivel] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [generadores, setGeneradores] = useState<Generador[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    cargarGeneradores();
  }, []);

  const cargarGeneradores = async () => {
    try {
      const generadoresGuardados = await AsyncStorage.getItem('generadores');
      if (generadoresGuardados) {
        setGeneradores(JSON.parse(generadoresGuardados));
      } else {
        setGeneradores([
          { id: 'G-001', nombre: 'Generador Principal', nivel: 75, estado: 'Operativo', ubicacion: 'Sede Santa Elena' },
          { id: 'G-002', nombre: 'Generador Secundario', nivel: 45, estado: 'Operativo', ubicacion: 'Sede Santa Elena' },
          { id: 'G-003', nombre: 'Generador Reserva', nivel: 15, estado: 'Alerta', ubicacion: 'Sede Santa Elena' },
        ]);
      }
    } catch (error) {
      console.error('Error al cargar generadores:', error);
      setGeneradores([
        { id: 'G-001', nombre: 'Generador Principal', nivel: 75, estado: 'Operativo', ubicacion: 'Sede Santa Elena' },
        { id: 'G-002', nombre: 'Generador Secundario', nivel: 45, estado: 'Operativo', ubicacion: 'Sede Santa Elena' },
        { id: 'G-003', nombre: 'Generador Reserva', nivel: 15, estado: 'Alerta', ubicacion: 'Sede Santa Elena' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrar = async () => {
    if (!generadorId) {
      Alert.alert('Error', 'Seleccione un generador');
      return;
    }
    
    const nivelNum = parseInt(nivel);
    if (!nivel || isNaN(nivelNum) || nivelNum < 0 || nivelNum > 100) {
      Alert.alert('Error', 'Ingrese un nivel válido (0-100%)');
      return;
    }
    
    try {
      const nuevosGeneradores = generadores.map(g => 
        g.id === generadorId ? { ...g, nivel: nivelNum, estado: nivelNum < 20 ? 'Alerta' : 'Operativo' } : g
      );
      
      await AsyncStorage.setItem('generadores', JSON.stringify(nuevosGeneradores));
      Alert.alert('Éxito', 'Nivel registrado correctamente (modo offline)');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el nivel');
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
        
        {generadores.map(generador => (
          <List.Item
            key={generador.id}
            title={generador.nombre}
            description={`ID: ${generador.id} | Nivel actual: ${generador.nivel}%`}
            left={props => <List.Icon {...props} icon="generator" />}
            onPress={() => setGeneradorId(generador.id)}
            style={[
              styles.listItem,
              generadorId === generador.id && styles.listItemSelected
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
        
        <Paragraph style={styles.offlineText}>Modo Offline - Los datos se sincronizarán al recuperar conexión</Paragraph>
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