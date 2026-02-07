import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard/index" options={{ title: 'Dashboard' }} />
        <Stack.Screen name="registro/index" options={{ title: 'Registrar Nivel' }} />
        <Stack.Screen name="alertas/index" options={{ title: 'Alertas' }} />
        <Stack.Screen name="reportes/index" options={{ title: 'Reportes' }} />
      </Stack>
    </PaperProvider>
  );
}