// app/index.tsx - Versión ultra simple para presentación
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  return <Redirect href="/dashboard" />;
}