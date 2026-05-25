import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar, Card, Provider as PaperProvider, Paragraph, Title } from 'react-native-paper';
import { combustibleService } from '../../services/combustible.service'; // CORREGIDO: solo combustibleService
import { GeneradorElectrico } from '../../types'; // AGREGADO: importar interfaz

// Definir interfaz para alertas
interface Alerta {
  id: string;
  titulo: string;
  mensaje: string;
  generador: number;
  fecha: string;
}

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]); // CORREGIDO: tipado explícito
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      const generadores = await combustibleService.obtenerGeneradores();
      const alertasCriticas = generadores
        .filter((g: GeneradorElectrico) => g.nivel_actual < 15) // CORREGIDO: usar GeneradorElectrico
        .map((g: GeneradorElectrico) => ({
          id: `alerta-${g.id}`,
          titulo: `¡Alerta de combustible crítico!`,
          mensaje: `${g.modelo} (${g.id}) tiene solo ${g.nivel_actual}% de combustible`,
          generador: g.id,
          fecha: new Date().toLocaleString()
        }));
      
      setAlertas(alertasCriticas); // CORREGIDO: ahora coincide el tipo
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}> {/* CORREGIDO: estilo agregado */}
        <Text>Cargando alertas...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Alertas" />
      </Appbar.Header>
      
      <View style={styles.alertasContainer}>
        {alertas.length === 0 ? (
          <Text style={styles.noAlertas}>No hay alertas críticas en este momento</Text>
        ) : (
          alertas.map((alerta: Alerta) => ( // CORREGIDO: tipado del parámetro
            <Card key={alerta.id} style={styles.alertaCard}>
              <Card.Content>
                <Title style={styles.alertaTitle}>{alerta.titulo}</Title>
                <Paragraph>{alerta.mensaje}</Paragraph>
                <Paragraph style={styles.alertaFecha}>Fecha: {alerta.fecha}</Paragraph>
              </Card.Content>
            </Card>
          ))
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  alertasContainer: {
    padding: 16,
  },
  alertaCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  alertaTitle: {
    color: '#D32F2F',
  },
  alertaFecha: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
  },
  noAlertas: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  loadingContainer: { // AGREGADO: estilo faltante
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});