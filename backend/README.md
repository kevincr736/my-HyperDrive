# 🚀 Servidor HYPERDRIVE Backend

Servidor HTTP para la aplicación HYPERDRIVE con API REST completa.

## 📋 Características

- ✅ Servidor Express.js
- ✅ CORS habilitado
- ✅ API REST para vehículos
- ✅ API para noticias
- ✅ API para marcas
- ✅ Middleware de errores
- ✅ Health check endpoint
- ✅ Manejo graceful de cierre

## 🚀 Instalación y Uso

### 1. Instalar dependencias:
```bash
npm install
```

### 2. Ejecutar servidor:
```bash
# Modo producción
npm start

# Modo desarrollo (con reinicio automático)
npm run dev
```

### 3. Verificar funcionamiento:
- Servidor: http://localhost:3000
- Health Check: http://localhost:3000/health
- API Cars: http://localhost:3000/api/cars
- API News: http://localhost:3000/api/news
- API Brands: http://localhost:3000/api/brands

## 📡 Endpoints Disponibles

### GET /
Información básica del servidor

### GET /health
Estado del servidor y métricas

### GET /api/cars
Lista todos los vehículos

### GET /api/cars/:category
Vehículos por categoría (deportivos, lujosos, clasicos, todo-terreno)

### GET /api/news
Lista de noticias

### GET /api/news/:id
Noticia específica por ID

### GET /api/brands
Lista de marcas

### GET /api/brands/:id
Marca específica por ID

## 📁 Estructura del Proyecto

```
backend/
├── routes/
│   ├── index.js      # Configuración de rutas
│   ├── cars.js       # Rutas de vehículos
│   ├── news.js       # Rutas de noticias
│   └── brands.js     # Rutas de marcas
├── server.js         # Servidor principal
├── package.json      # Dependencias
└── README.md         # Documentación
```

## 🔧 Configuración

- Puerto: 3000 (configurable con variable PORT)
- CORS: Habilitado para todas las rutas
- JSON: Parsing automático
- Archivos estáticos: Carpeta public/

## 📝 Variables de Entorno

```bash
PORT=3000
NODE_ENV=development
```

## 🛠️ Desarrollo

El servidor se reinicia automáticamente con nodemon en modo desarrollo.
