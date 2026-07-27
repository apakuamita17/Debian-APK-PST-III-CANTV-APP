## 📱 PST III - Aplicación Móvil de Gestión de Combustible (CANTV Lara)

Aplicación móvil desarrollada con **React Native + Expo** para el registro y monitoreo de niveles de combustible en motogeneradores eléctricos. Proyecto Sociotecnológico III (PST III) de la UNETI, en integración con el sistema backend del PST II.

## 🎯 Descripción del Proyecto

Esta aplicación permite a los técnicos de campo de CANTV Lara registrar niveles de combustible directamente desde sus dispositivos móviles, incluso **sin conexión a internet** (modo offline). Los datos se sincronizan automáticamente con el backend Django/PostgreSQL del PST II cuando se recupera la conexión.

## Características Principales
- ✅ Registro de niveles de combustible en campo
- ✅ Funcionamiento offline con AsyncStorage (NoSQL local)
- ✅ Sincronización automática al recuperar conexión
- ✅ Dashboard con estado de generadores en tiempo real
- ✅ Alertas automáticas para niveles críticos (<15%)
- ✅ Reutilización de la API REST del PST II

## 🚀 Inicio Rápido

## Requisitos Previos


| Componente | Versión Mínima |
|------------|----------------|
| Node.js | 18.x o superior |
| npm | 9.x o superior |
| Expo CLI | 5.x o superior |
| Dispositivo Móvil | Android 8.0+ (con Expo Go) |


## Instalación

```bash
1. Clonar el repositorio
git clone https://github.com/apakuamita17/Debian-APK-PST-III-CANTV-APP.git
cd Debian-APK-PST-III-CANTV-APP

2. Instalar dependencias
npm install

3. Iniciar la aplicación
npx expo start
```

**Ejecución en Dispositivo Móvil**
1. Instala **Expo Go** desde Google Play Store (Android) o App Store (iOS)
2. Escanea el código QR que aparece en la terminal
3. La aplicación se cargará automáticamente en tu dispositivo

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────┐
│         FRONTEND MÓVIL (PST III)        │
│   React Native + Expo + AsyncStorage    │
│   • Dashboard • Registro • Alertas      │
└─────────────────┬───────────────────────┘
                  │ (API REST)
                  ▼
┌─────────────────────────────────────────┐
│         BACKEND (PST II - Existente)    │
│   Django + PostgreSQL + Django REST     │
│   • /api/generadores/ • /api/consumos/  │
└─────────────────────────────────────────┘
```

## Estructura del Proyecto
```
Debian-APK-PST-III-CANTV-APP/
├── app/                    # Pantallas de la aplicación
│   ├── dashboard/          # Dashboard de generadores
│   ├── registro/           # Formulario de registro
│   ├── alertas/            # Pantalla de alertas críticas
│   └── _layout.tsx         # Configuración de navegación
├── services/               # Capa de servicios
│   ├── api.service.ts      # Conexión con API del PST II
│   ├── combustible.service.ts  # Lógica de negocio
│   └── sincronizacion.service.ts # Sincronización offline
├── types.ts                # Interfaces TypeScript
├── package.json            # Dependencias del proyecto
└── README.md               # Este archivo
```

## 🔌 Conexión con el Backend (PST II)

La aplicación está diseñada para conectarse con la API REST del PST II (Django), la cual está disponible **[aquí](https://github.com/darwinjcn/sistema-gestion-combustible)**. Para configurar la conexión:

1. Edita el archivo `services/api.service.ts`
2. Modifica la constante `BASE_URL` con la dirección de tu backend:
```typescript
const BASE_URL = 'http://TU_IP_O_SERVIDOR:8000/api';
```

**Nota:** Si el backend no está disponible, la aplicación cargará datos de prueba (mocks) automáticamente para permitir la demostración funcional.

## 📦 Dependencias Principales

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `react-native` | 0.72+ | Framework móvil multiplataforma |
| `expo` | 49+ | Entorno de desarrollo y despliegue |
| `@react-native-async-storage/async-storage` | 1.x | Almacenamiento local offline |
| `react-native-paper` | 5.x | Componentes UI Material Design |
| `expo-router` | 2.x | Navegación entre pantallas |

## 🧪 Pruebas

```bash
# Verificar errores de TypeScript
npx tsc --noEmit

# Iniciar en modo limpieza de caché
npx expo start --clear
```

## 👥 Equipo de Desarrollo

| Integrante | Rol |
|------------|-----|
| GianneFran Radomile | Desarrollo Frontend Móvil |
| Jairo Jiménez | Desarrollo Frontend Móvil |
| Anggelo Martínez | Desarrollo Frontend Móvil |

**Docente Asesora:** María Herrera  
**Institución:** Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI)  
**Comunidad Beneficiaria:** CANTV Lara, Región Occidente

## 📄 Licencia

Este proyecto está bajo la Licencia Pública General de GNU v3.0 (GPL-3.0).

## 🔗 Enlaces de Interés

- **Repositorio PST II (Backend):** [URL si está disponible]
- **Documentación Técnica:** [URL del PDF si está en línea]
- **Expo Documentation:** https://docs.expo.dev/
- **React Native:** https://reactnative.dev/

---

**Barquisimeto, Venezuela - 2026**
