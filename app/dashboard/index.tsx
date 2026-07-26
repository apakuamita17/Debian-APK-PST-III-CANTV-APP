import { useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Card, Provider as PaperProvider, ProgressBar, Title, Paragraph } from 'react-native-paper';
import { combustibleService } from '../../services/combustible.service';
import { GeneradorElectrico } from '../../types';

/**
 * COMPONENTE PRINCIPAL: DashboardScreen
 * Pantalla de monitoreo general del estado de los motogeneradores y niveles de combustible.
 */
export default function DashboardScreen() {
  // ==========================================
  // ESTADOS DEL COMPONENTE (State)
  // ==========================================
  const [generadores, setGeneradores] = useState<GeneradorElectrico[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hook de navegación de Expo Router
  const router = useRouter();

  // EFECTO: Carga inicial de datos al montar la pantalla
  useEffect(() => {
    cargarGeneradores();
  }, []);

  /**
   * FUNCIÓN: cargarGeneradores
   * Consulta la lista de motogeneradores mediante el servicio de combustible.
   * Incluye un bloque de datos de respaldo (fallback) en caso de fallas de conexión.
   */
  const cargarGeneradores = async () => {
    try {
      // Reutilización directa de la lógica del PST II
      const datos = await combustibleService.obtenerGeneradores();
      setGeneradores(datos);
    } catch (error) {
      console.error('Error al cargar generadores:', error);
      // Fallback: datos de prueba si la API no responde
      setGeneradores([
        { id: 1, modelo: 'Generador Principal', nivel_actual: 75, estado: 'activo', capacidad_tanque: 1000 },
        { id: 2, modelo: 'Generador Secundario', nivel_actual: 45, estado: 'activo', capacidad_tanque: 1000 },
        { id: 3, modelo: 'Generador Reserva', nivel_actual: 15, estado: 'alerta', capacidad_tanque: 1000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * FUNCIÓN DE RENDERIZADO: renderGenerador
   * Construye la tarjeta individual para cada generador con su barra de nivel de combustible.
   */
  const renderGenerador = (generador: GeneradorElectrico) => {
    // Definición de colores del semáforo de alerta según el nivel (%)
    const colorProgreso = generador.nivel_actual < 20 
      ? '#ef4444' // Rojo (Crítico / Alerta)
      : generador.nivel_actual < 50 
        ? '#f59e0b' // Naranja (Precaución)
        : '#10b981'; // Verde (Óptimo)

    const esAlerta = generador.estado === 'alerta';

    return (
      <Card key={generador.id} style={styles.generadorCard}>
        <Card.Content style={styles.cardContent}>
          
          {/* Encabezado de la Tarjeta: Nombre y Estado */}
          <View style={styles.generadorHeader}>
            <View>
              <Title style={styles.cardTitle}>{generador.modelo}</Title>
              <Text style={styles.cardSubtitle}>ID de Equipo: {generador.id}</Text>
            </View>
            
            {/* Badge de Estado del Generador */}
            <View style={[styles.badgeEstado, esAlerta ? styles.badgeAlerta : styles.badgeActivo]}>
              <View style={[styles.badgeDot, { backgroundColor: esAlerta ? '#ef4444' : '#10b981' }]} />
              <Text style={[styles.estadoText, esAlerta ? styles.estadoTextAlerta : styles.estadoTextActivo]}>
                {generador.estado.toUpperCase()}
              </Text>
            </View>
          </View>
          
          {/* Ubicación del Generador */}
          <Paragraph style={styles.ubicacionText}>
            📍 Ubicación: <Text style={styles.ubicacionValue}>{generador.coordenadas_gps || 'N/A'}</Text>
          </Paragraph>
          
          {/* Módulo de Medidor de Combustible */}
          <View style={styles.progresoContainer}>
            <View style={styles.progresoLabelRow}>
              <Text style={styles.progresoLabel}>Nivel de combustible</Text>
              <Text style={[styles.progresoPorcentaje, { color: colorProgreso }]}>
                {generador.nivel_actual}%
              </Text>
            </View>

            {/* Barra de Progreso */}
            <View style={styles.progressTrack}>
              <ProgressBar 
                progress={generador.nivel_actual / 100} 
                color={colorProgreso} 
                style={styles.progressBar} 
              />
            </View>
          </View>

        </Card.Content>
      </Card>
    );
  };

  // PANTALLA DE CARGA (Loading State)
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Cargando estado de generadores...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        
        {/* ==========================================
            1. CONFIGURACIÓN DEL HEADER (Barra Superior)
           ========================================== */}
        <Stack.Screen
          options={{
            title: 'Dashboard General',
            headerStyle: {
              backgroundColor: '#1e293b',
            },
            headerTintColor: '#f8fafc',
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 16,
            },
            headerShadowVisible: false,
            // Botón de Alertas y Badge en la barra superior
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <Pressable 
                  onPress={() => router.push('/alertas')} 
                  style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
                >
                  <Text style={styles.bellIcon}>🔔</Text>
                </Pressable>
                
                <View style={styles.headerBrandBadge}>
                  <View style={styles.headerDot} />
                  <Text style={styles.headerBrandText}>CANTV • PST-III</Text>
                </View>
              </View>
            ),
          }}
        />

        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        
        {/* ==========================================
            2. CONTENIDO PRINCIPAL SCROLLABLE
           ========================================== */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.dashboardContainer}>
            
            {/* Encabezado de la Sección */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Estado de los Generadores</Text>
              <Text style={styles.sectionSubTitle}>Monitoreo en tiempo real de plantas eléctricas</Text>
            </View>
            
            {/* Botón de Acción Principal (+ Registrar Nivel) */}
            <Pressable 
              style={({ hovered, pressed }) => [
                styles.addButton,
                hovered && styles.buttonHover,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push('/registro')}
            >
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Registrar Nivel de Combustible</Text>
            </Pressable>
            
            {/* Lista de Generadores */}
            <View style={styles.listContainer}>
              {generadores.map(renderGenerador)}
            </View>

            {/* Pie de página institucional */}
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

// =========================================================================
// HOJA DE ESTILOS (StyleSheet)
// Basada en la Paleta Corporativa Oscura (#0f172a / #1e293b / #38bdf8)
// =========================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  dashboardContainer: {
    paddingHorizontal: 20,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },

  // Estado de carga
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

  // Header y Badges
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  bellIcon: {
    fontSize: 16,
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

  // Titulares
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  sectionSubTitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },

  // Botón Registrar (Azul Cian)
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonHover: {
    backgroundColor: '#0369a1',
    cursor: 'pointer',
  },
  buttonPressed: {
    backgroundColor: '#075985',
    transform: [{ scale: 0.99 }],
  },
  addButtonIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
    marginTop: -2,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Lista de Generadores
  listContainer: {
    gap: 16,
  },
  generadorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 3,
  },
  cardContent: {
    padding: 18,
  },
  generadorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // Badges de Estado
  badgeEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeActivo: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  badgeAlerta: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  estadoText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  estadoTextActivo: {
    color: '#34d399',
  },
  estadoTextAlerta: {
    color: '#f87171',
  },

  // Ubicación
  ubicacionText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 14,
  },
  ubicacionValue: {
    color: '#cbd5e1',
    fontWeight: '500',
  },

  // Medidor y Barras de Progreso
  progresoContainer: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  progresoLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progresoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  progresoPorcentaje: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrack: {
    overflow: 'hidden',
    borderRadius: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 6,
    backgroundColor: '#334155',
  },

  // Pie de página
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 11,
  },
});
