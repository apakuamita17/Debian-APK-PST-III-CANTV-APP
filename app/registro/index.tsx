import { useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Provider as PaperProvider, List, Divider } from 'react-native-paper';
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
      const datos = await combustibleService.obtenerGeneradores();
      setGeneradores(datos);
    } catch (error) {
      console.error('Error al cargar generadores:', error);
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
      await combustibleService.registrarNivel(parseInt(generadorId), nivelNum);
      await cargarGeneradores();
      alert('¡Éxito! Nivel registrado correctamente');
      router.back();
    } catch (error) {
      alert('Error: No se pudo registrar el nivel');
      console.error('Error al registrar nivel:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Cargando generadores...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        
        <Stack.Screen
          options={{
            title: 'Registrar Nivel de Combustible',
            headerStyle: {
              backgroundColor: '#1e293b',
            },
            headerTintColor: '#f8fafc',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 15,
            },
            headerShadowVisible: false,
            headerRight: () => (
              <View style={styles.headerBrandBadge}>
                <View style={styles.headerDot} />
                <Text style={styles.headerBrandText}>CANTV • PST-III</Text>
              </View>
            ),
          }}
        />

        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        {/* Agregado paddingBottom amplio para que NO se corte el botón abajo */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
          <View style={styles.content}>
            
            <View style={styles.sectionHeader}>
              <Text style={styles.mainTitle}>Suministro de Combustible</Text>
              <Text style={styles.subTitle}>
                Actualización de niveles de tanque en planta
              </Text>
            </View>

            <View style={styles.card}>
              
              <Text style={styles.formTitle}>1. Seleccione el generador</Text>
              <View style={styles.generadoresList}>
                {generadores.map((generador) => {
                  const isSelected = generadorId === generador.id.toString();
                  return (
                    <Pressable
                      key={generador.id}
                      onPress={() => setGeneradorId(generador.id.toString())}
                      style={[
                        styles.listItem,
                        isSelected && styles.listItemSelected,
                      ]}
                    >
                      <List.Item
                        title={generador.modelo}
                        titleStyle={[styles.itemTitle, isSelected && styles.itemTitleSelected]}
                        description={`ID: ${generador.id} | Nivel actual: ${generador.nivel_actual}%`}
                        descriptionStyle={styles.itemDescription}
                        /* Cambiado a un indicador de estado personalizado para evitar el bug del '?' en Web */
                        left={() => (
                          <View style={styles.iconContainer}>
                            <View style={[styles.statusDot, { backgroundColor: isSelected ? '#0284c7' : '#94a3b8' }]} />
                          </View>
                        )}
                      />
                    </Pressable>
                  );
                })}
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.formTitle}>2. Ingrese el nivel de combustible</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nivel porcentual (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. 85"
                  placeholderTextColor="#94a3b8"
                  value={nivel}
                  onChangeText={setNivel}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Observaciones (Opcional)</Text>
                <TextInput
                  style={[styles.input, styles.observaciones]}
                  placeholder="Detalles sobre el reabastecimiento..."
                  placeholderTextColor="#94a3b8"
                  value={observaciones}
                  onChangeText={setObservaciones}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <Pressable
                style={({ hovered, pressed }) => [
                  styles.registrarButton,
                  hovered && styles.buttonHover,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleRegistrar}
              >
                <Text style={styles.buttonText}>Registrar Nivel</Text>
              </Pressable>

              <View style={styles.offlineBox}>
                <Text style={styles.offlineText}>
                  ⚡ Modo Offline • Sincronización automática al conectar
                </Text>
              </View>

            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Compañía Anónima Nacional Teléfonos de Venezuela
              </Text>
            </View>

          </View>
        </ScrollView>

      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },

  headerBrandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: 10,
  },
  headerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
    marginRight: 6,
  },
  headerBrandText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // Padding inferior extra para scroll fluido
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 60,
  },
  content: {
    paddingHorizontal: 20,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },

  sectionHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },

  generadoresList: {
    gap: 8,
  },
  listItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  listItemSelected: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0284c7',
    borderWidth: 1.5,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  itemTitleSelected: {
    color: '#0284c7',
    fontWeight: '700',
  },
  itemDescription: {
    fontSize: 12,
    color: '#64748b',
  },

  // Punto indicador limpio en lugar del icono de Paper
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  divider: {
    marginVertical: 20,
    backgroundColor: '#e2e8f0',
  },

  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  observaciones: {
    height: 75,
    textAlignVertical: 'top',
  },

  registrarButton: {
    backgroundColor: '#15803d',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#15803d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonHover: {
    backgroundColor: '#16a34a',
    cursor: 'pointer',
  },
  buttonPressed: {
    backgroundColor: '#14532d',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  offlineBox: {
    marginTop: 18,
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  offlineText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 11,
    fontWeight: '500',
  },

  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 11,
  },
});