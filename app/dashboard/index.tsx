import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar, Button, Card, Provider as PaperProvider, Paragraph, ProgressBar, Title } from 'react-native-paper';
import { Generador } from '../../types';

// Datos de prueba
const GENERADORES_INICIALES: Generador[] = [
  { id: 'G-001', nombre: 'Generador Principal', nivel: 75, estado: 'Operativo', ubicacion: 'Sede Santa Elena' },
  { id: 'G-002', nombre: 'Generador Secundario', nivel: 45, estado: 'Operativo', ubicacion: 'Sede Santa Elena' },
  { id: 'G-003', nombre: 'Generador Reserva', nivel: 15, estado: 'Alerta', ubicacion: 'Sede Santa Elena' },
];

export default function DashboardScreen() {
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
        await AsyncStorage.setItem('generadores', JSON.stringify(GENERADORES_INICIALES));
        setGeneradores(GENERADORES_INICIALES);
      }
    } catch (error) {
      console.error('Error al cargar generadores:', error);
      setGeneradores(GENERADORES_INICIALES);
    } finally {
      setLoading(false);
    }
  };

  const renderGenerador = (generador: Generador) => {
    const colorProgreso = generador.nivel < 20 ? '#D32F2F' : generador.nivel < 50 ? '#FFA726' : '#43A047';
    
    return (
      <Card key={generador.id} style={styles.generadorCard}>
        <Card.Content>
          <View style={styles.generadorHeader}>
            <Title>{generador.nombre} ({generador.id})</Title>
            <Text style={[styles.estado, generador.estado === 'Alerta' && styles.estadoAlerta]}>
              {generador.estado}
            </Text>
          </View>
          
          <Paragraph>Ubicación: {generador.ubicacion}</Paragraph>
          
          <View style={styles.progresoContainer}>
            <Text>Nivel de combustible: {generador.nivel}%</Text>
            <ProgressBar 
              progress={generador.nivel / 100} 
              color={colorProgreso} 
              style={styles.progressBar} 
            />
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando estado de generadores...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="bell" onPress={() => router.push('/alertas')} />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.dashboardContainer}>
          <Text style={styles.sectionTitle}>Estado de los Generadores</Text>
          
          <Button 
            mode="contained" 
            icon="plus" 
            style={styles.addButton}
            onPress={() => router.push('/registro')}
          >
            Registrar Nivel de Combustible
          </Button>
          
          <View style={styles.listContainer}>
            {generadores.map(renderGenerador)}
          </View>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  dashboardContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: '#1E88E5',
  },
  listContainer: {
    marginTop: 8,
  },
  generadorCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  generadorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  estado: {
    fontWeight: 'bold',
  },
  estadoAlerta: {
    color: '#D32F2F',
  },
  progresoContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});