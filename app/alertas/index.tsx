import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar, Card, Provider as PaperProvider, Paragraph, Title } from 'react-native-paper';
import { Alerta, Generador } from '../../types';

export default function AlertasScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      const generadoresGuardados = await AsyncStorage.getItem('generadores');
      if (generadoresGuardados) {
        const generadores: Generador[] = JSON.parse(generadoresGuardados);
        const nuevasAlertas = generadores
          .filter((g: Generador) => g.nivel < 20)
          .map((g: Generador) => ({
            id: `alerta-${g.id}`,
            titulo: `¡Alerta de combustible crítico!`,
            mensaje: `${g.nombre} (${g.id}) tiene solo ${g.nivel}% de combustible`,
            generador: g.id,
            fecha: new Date().toLocaleString()
          }));
        
        setAlertas(nuevasAlertas);
      }
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAlerta = (alerta: Alerta) => (
    <Card key={alerta.id} style={styles.alertaCard}>
      <Card.Content>
        <Title style={styles.alertaTitle}>{alerta.titulo}</Title>
        <Paragraph>{alerta.mensaje}</Paragraph>
        <Paragraph style={styles.alertaFecha}>Fecha: {alerta.fecha}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
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
          alertas.map(renderAlerta)
        )}
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
});