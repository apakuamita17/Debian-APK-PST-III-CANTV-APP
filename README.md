# Debian APK - PST III - CANTV App - Aplicación Móvil de Gestión de Combustible en los Motogeneradores Eléctricos en CANTV Lara, Región Occidente

## Descripción del Proyecto

Aplicación móvil para la gestión de combustible de los motogeneradores eléctricos en CANTV Lara, Región Occidente. Desarrollada como parte del Proyecto Sociotecnológico III (PST III) de la UNETI.

## Requisitos

- Node.js (v18 o superior)
- npm
- Expo Go (en el dispositivo móvil para pruebas)

## Instrucciones para Clonar y Configurar el Proyecto

### Paso 1: Instalar Node.js (si no lo tienen)
Descargar e instalar Node.js desde: https://nodejs.org/

### Paso 2: Clonar el repositorio
Abrir una terminal y ejecutar estos comandos uno por uno:

```bash
git clone https://github.com/[TU_USUARIO]/pst-cantv-app.git
cd pst-cantv-app
```

Paso 3: Instalar todas las dependencias
Ejecutar estos comandos en orden:

```bash
npm install
npx expo install
npm install react-native-paper @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens react-native-vector-icons
```

Paso 4: Ejecutar el proyecto

```bash
npx expo start
```

### Paso 5: Ver la aplicación en el móvil

1. Instalar la app "Expo Go" desde Google Play Store o App Store.
2. Abrir Expo Go en el dispositivo móvil.
3. Escanear el código QR que aparece en la terminal.
4. ¡Listo! La aplicación se cargará en el dispositivo.

Características del Proyecto

Modo offline funcional (almacena datos localmente)
Registro de niveles de combustible en campo
Dashboard con estado de generadores
Alertas automáticas para niveles críticos (<20%)
Diseño Material Design con React Native Paper
Navegación con Expo Router

### Estructura del Proyecto

pst-cantv-app/
├── app/
│   ├── alertas/
│   │   └── index.tsx          # Pantalla de alertas
│   ├── dashboard/
│   │   └── index.tsx          # Dashboard principal
│   ├── registro/
│   │   └── index.tsx          # Registro de niveles
│   └── _layout.tsx            # Configuración de navegación
├── types.ts                   # Interfaces TypeScript
├── package.json              # Dependencias del proyecto
├── tsconfig.json             # Configuración TypeScript
└── README.md                 # Este archivo

### Reutilización de Componentes del PST II
Este PST reutiliza estratégicamente componentes del PST II (Sistema Web):

Lógica de negocio: Cálculo de consumo y reglas de alerta ya validadas
Modelo de datos: Estructura de generadores, niveles y usuarios
API REST: Backend desarrollado con Django (para integración futura)
Aprendizajes: Importancia de operatividad offline identificada en PST II

### Troubleshooting (Solución de Problemas)
Si la aplicación no carga en Expo Go:

1. Cerrar completamente la app Expo Go
2. Ejecutar npx expo start -c (limpia caché)
3. Volver a escanear el QR

Si hay errores de TypeScript:
Ejecutar npx tsc --noEmit para verificar errores

Si falta alguna dependencia:
Ejecutar npm install nuevamente
