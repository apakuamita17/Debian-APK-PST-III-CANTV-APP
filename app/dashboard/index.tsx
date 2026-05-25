import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar, Button, Card, Provider as PaperProvider, Paragraph, ProgressBar, Title } from 'react-native-paper';
import { combustibleService } from '../../services/combustible.service';
import { GeneradorElectrico } from '../../types';

export default function DashboardScreen() {
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

  const renderGenerador = (generador: GeneradorElectrico) => {
    const colorProgreso = generador.nivel_actual < 20 ? '#D32F2F' : generador.nivel_actual < 50 ? '#FFA726' : '#43A047';
    
    return (
      <Card key={generador.id} style={styles.generadorCard}>
        <Card.Content>
          <View style={styles.generadorHeader}>
            <Title>{generador.modelo} (ID: {generador.id})</Title>
            <Text style={[styles.estado, generador.estado === 'alerta' && styles.estadoAlerta]}>
              {generador.estado}
            </Text>
          </View>
          
          <Paragraph>Ubicación: {generador.coordenadas_gps || 'N/A'}</Paragraph>
          
          <View style={styles.progresoContainer}>
            <Text>Nivel de combustible: {generador.nivel_actual}%</Text>
            <ProgressBar 
              progress={generador.nivel_actual / 100} 
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