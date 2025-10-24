# HyperDrive 🚗

Una aplicación completa de vehículos con backend Node.js y frontend React Native.

## 📋 Descripción

HyperDrive es una aplicación móvil desarrollada con React Native que permite a los usuarios explorar catálogos de vehículos, ver noticias del sector automotriz y gestionar un vehículo destacado del mes. La aplicación incluye un backend robusto con API REST y base de datos MongoDB.

## 🏗️ Arquitectura

### Backend (Node.js + Express + MongoDB)
- **API REST** para gestión de vehículos
- **Base de datos MongoDB** con Mongoose
- **Endpoints** para vehículo mensual con imágenes base64
- **Conversión automática** de URLs de imagen a base64

### Frontend (React Native + Expo)
- **Interfaz móvil** moderna y responsiva
- **Navegación** entre pantallas
- **Gestión de imágenes** base64
- **Componentes reutilizables**

## 🚀 Características Principales

### Backend
- ✅ **API REST** completa
- ✅ **Modelo MonthlyCar** para vehículo destacado
- ✅ **Conversión URL → Base64** automática
- ✅ **Validación de datos** con Mongoose
- ✅ **Endpoints** para CRUD de vehículos

### Frontend
- ✅ **Pantalla principal** con vehículo del mes
- ✅ **Catálogos** por categorías (Deportivos, Lujosos, Clásicos, SUV)
- ✅ **Noticias** del sector automotriz
- ✅ **Historia de marcas** automotrices
- ✅ **Sistema de navegación** completo

## 📁 Estructura del Proyecto

```
hyperdrive/
├── backend/                 # API Node.js
│   ├── models/             # Modelos de MongoDB
│   ├── router/             # Rutas de la API
│   ├── services/           # Lógica de negocio
│   ├── public/             # Archivos estáticos
│   └── package.json
└── my-hyperdrive/          # App React Native
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── screens/        # Pantallas de la app
    │   └── theme/          # Tema y colores
    ├── assets/             # Imágenes y recursos
    └── package.json
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB
- Expo CLI
- Git

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd my-hyperdrive
npm install
npx expo start -c
```

## 🔧 API Endpoints

### Vehículo Mensual
- `POST /cars/create/monthly_car` - Crear/actualizar vehículo mensual
- `GET /cars/monthly_car` - Obtener vehículo mensual actual

### Parámetros para crear vehículo:
```bash
curl "http://localhost:3000/cars/create/monthly_car?name=Ferrari%20F8&description=Superdeportivo%20italiano&imageUrl=https://example.com/image.jpg"
```

## 📱 Pantallas de la App

- **HomeScreen** - Pantalla principal con vehículo del mes
- **CatalogScreen** - Catálogo de vehículos por categorías
- **NewsScreen** - Noticias del sector automotriz
- **BrandHistoryScreen** - Historia de marcas automotrices
- **LoginScreen** - Autenticación de usuarios

## 🎨 Componentes Principales

- **Base64Image** - Manejo de imágenes base64
- **ModelsCarousel** - Carrusel de modelos
- **BrandsCarousel** - Carrusel de marcas
- **NewsItem** - Item de noticias
- **SideMenu** - Menú lateral

## 🔄 Flujo de Datos

1. **Backend** recibe URL de imagen
2. **Conversión** automática a base64
3. **Almacenamiento** en MongoDB
4. **Frontend** consume API
5. **Renderizado** de imagen base64

## 🚀 Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS

### Frontend
- React Native
- Expo
- React Navigation
- Linear Gradient
- Vector Icons

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para la comunidad automotriz.

---

**Nota**: Asegúrate de tener MongoDB ejecutándose antes de iniciar el backend.

npx expo start -c 