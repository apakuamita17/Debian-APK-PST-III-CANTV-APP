import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Appbar, Card, Provider as PaperProvider, Title } from 'react-native-paper';

// Datos de prueba para los generadores
const GENERADORES_INICIALES = [
  { id: 'G-001', nombre: 'Generador Principal', nivel: 75, estado: 'Operativo', ubicacion: 'Sede Santa Elena' },
  { id: 'G-002', nombre: 'Generador Secundario', nivel: 45, estado: 'Operativo', ubicacion: 'Sede Santa Elena' },
  { id: 'G-003', nombre: 'Generador Reserva', nivel: 15, estado: 'Alerta', ubicacion: 'Sede Santa Elena' },
];

// Pantalla de inicio de sesión
export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    
    // Simulamos una validación básica
    if (username === '' || password === '') {
      Alert.alert('Error', 'Por favor ingrese usuario y contraseña');
      setLoading(false);
      return;
    }

    // Guardamos el usuario para mantener la sesión
    try {
      await AsyncStorage.setItem('user', JSON.stringify({ username, role: 'tecnico' }));
      
      // Simulamos un tiempo de respuesta
      setTimeout(() => {
        router.replace('/dashboard');
        setLoading(false);
      }, 800);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="CANTV Lara - Gestión de Combustible" />
      </Appbar.Header>
      
      <View style={styles.loginContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Inicio de Sesión</Title>
            
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <Button 
              title={loading ? "Iniciando..." : "Iniciar Sesión"} 
              onPress={handleLogin} 
              disabled={loading}
              color="#1E88E5"
            />
            
            <Text style={styles.offlineText}>Modo Offline - Datos se sincronizarán al recuperar conexión</Text>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
}

// Estilos
const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
  offlineText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});