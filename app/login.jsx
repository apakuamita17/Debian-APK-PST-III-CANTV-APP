import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';

/**
 * COMPONENTE PRINCIPAL: LoginScreen
 * Representa la pantalla de inicio de sesión y autenticación para
 * el Sistema de Gestión de Motogeneradores de CANTV.
 */
export default function LoginScreen() {
  // Hook de navegación de Expo Router para realizar la redirección de páginas
  const router = useRouter();
  
  // ==========================================
  // ESTADOS DEL FORMULARIO (State Management)
  // ==========================================
  const [usuario, setUsuario] = useState('');     // Almacena el texto introducido en el campo Usuario/Ficha
  const [password, setPassword] = useState('');   // Almacena la contraseña ingresada
  const [loading, setLoading] = useState(false);  // Controla el estado de carga (muestra el Spinner)
  const [error, setError] = useState('');        // Guarda el mensaje de error si las credenciales fallan

  // ==========================================
  // CREDENCIALES ESTÁTICAS DE ACCESO
  // ==========================================
  const USUARIO_CORRECTO = 'cantv';
  const PASSWORD_CORRECTO = '12345';

  /**
   * FUNCIÓN: handleLogin
   * Procesa la validación de las credenciales y ejecuta el redireccionamiento
   */
  const handleLogin = () => {
    // 1. Validar que los campos no estén vacíos
    if (!usuario.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // 2. Validar que coincidan con las credenciales esperadas
    if (
      usuario.trim().toLowerCase() !== USUARIO_CORRECTO ||
      password !== PASSWORD_CORRECTO
    ) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    // 3. Autenticación exitosa
    setError('');
    setLoading(true);

    // Simula una pequeña latencia de red (800ms) antes de llevar al Dashboard
    setTimeout(() => {
      setLoading(false);
      router.replace('/dashboard'); // Redirige a la vista principal sin opción de volver atrás
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ==========================================
          1. CONFIGURACIÓN DEL HEADER (Expo Router)
          Personaliza la barra de navegación superior.
         ========================================== */}
      <Stack.Screen
        options={{
          title: 'Bienvenido al Sistema de Motogeneradores de CANTV',
          headerStyle: {
            backgroundColor: '#1e293b', // Fondo Gris Neutro Oscuro (Slate)
          },
          headerTintColor: '#f8fafc', // Color de texto claro
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 15,
          },
          headerShadowVisible: false, // Elimina la sombra por defecto del header
          // Componente personalizado insertado en la esquina superior derecha
          headerRight: () => (
            <View style={styles.headerBrandBadge}>
              <View style={styles.headerDot} />
              <Text style={styles.headerBrandText}>CANTV • PST-III</Text>
            </View>
          ),
        }}
      />

      {/* Control de la barra de estado del dispositivo/navegador */}
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Evita que el teclado virtual tape el formulario en móviles */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Permite desplazamiento en pantallas pequeñas para no cortar contenido */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            
            {/* ==========================================
                2. ENCABEZADO TÍTULO DE LA PÁGINA
               ========================================== */}
            <View style={styles.headerContainer}>
              <Text style={styles.mainTitle}>Sistema de Gestión de Motogeneradores</Text>
              <Text style={styles.subTitle}>
                Planta de Suministro y Telecomunicaciones (PST-III)
              </Text>
            </View>

            {/* ==========================================
                3. TARJETA CONTENEDORA DEL FORMULARIO
               ========================================== */}
            <View style={styles.card}>
              
              {/* Título interno de bienvenida */}
              <View style={styles.cardHeader}>
                <Text style={styles.welcomeText}>Bienvenido de nuevo</Text>
                <Text style={styles.welcomeSubtext}>
                  Ingresa tus credenciales para acceder al sistema
                </Text>
              </View>

              {/* Módulos de alerta (Solo se renderiza si el estado 'error' contiene texto) */}
              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Campo Entrada: Usuario */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Usuario / Ficha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. cantv"
                  placeholderTextColor="#94a3b8"
                  value={usuario}
                  onChangeText={(text) => {
                    setUsuario(text);
                    setError(''); // Limpia el mensaje de error cuando el usuario escribe
                  }}
                  autoCapitalize="none"
                />
              </View>

              {/* Campo Entrada: Contraseña */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry // Oculta los caracteres de la clave
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                />
              </View>

              {/* ==========================================
                  4. BOTÓN INTERACTIVO (Con Hover y Click)
                 ========================================== */}
              <Pressable
                style={({ hovered, pressed }) => [
                  styles.button,
                  hovered && styles.buttonHover,   // Estilo aplicado al pasar el mouse por encima
                  pressed && styles.buttonPressed, // Estilo aplicado al presionar/hacer clic
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Iniciar Sesión</Text>
                )}
              </Pressable>
            </View>

            {/* ==========================================
                5. PIE DE PÁGINA INSTITUCIONAL
               ========================================== */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Compañía Anónima Nacional Teléfonos de Venezuela
              </Text>
              <Text style={styles.footerSubtext}>
                © 2026 Todos los derechos reservados
              </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =========================================================================
// HOJA DE ESTILOS (StyleSheet)
// Define toda la apariencia, estructura flexbox, colores y transiciones.
// =========================================================================
const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Fondo Azul Marino Oscuro Institucional
  },

  // Insignia/Badge en la esquina superior derecha del Header
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
    backgroundColor: '#38bdf8', // Punto luminoso cian indicador de estado
    marginRight: 6,
  },
  headerBrandText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // Centra la tarjeta verticalmente en pantalla
    paddingVertical: 40,      // Da espacio suficiente arriba y abajo
  },
  content: {
    paddingHorizontal: 24,
    maxWidth: 440,            // Ancho máximo para que no se extienda demasiado en monitores grandes
    width: '100%',
    alignSelf: 'center',      // Centra el bloque de la app horizontalmente
  },

  // Estilos del Encabezado
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 32,
  },
  subTitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400',
  },

  // Estilos de la Tarjeta (Card)
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,              // Sombra flotante para Android/Web
  },
  cardHeader: {
    marginBottom: 24,
    alignItems: 'center',      // Centra el texto de bienvenida dentro de la tarjeta
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  welcomeSubtext: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
  },

  // Estilos para la caja de alertas/errores
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Estilos de las entradas de texto (Inputs)
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
  },

  // Estilos base y estados interactivos del Botón
  button: {
    backgroundColor: '#1e3a8a', // Azul Marino Formal
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    transitionProperty: 'all',  // Permite animación fluida del hover en navegadores
    transitionDuration: '150ms',
  },
  buttonHover: {
    backgroundColor: '#2563eb', // Aumenta brillo al pasar el ratón
    transform: [{ scale: 1.02 }],// Micro-zoom suave (efecto elevado)
    shadowOpacity: 0.4,
    shadowRadius: 10,
    cursor: 'pointer',
  },
  buttonPressed: {
    backgroundColor: '#1d4ed8',
    transform: [{ scale: 0.98 }],// Sensación de hundimiento al hacer clic
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Estilos del Pie de Página (Footer)
  footer: {
    marginTop: 28,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  footerSubtext: {
    color: '#475569',
    fontSize: 11,
    marginTop: 4,
  },
});