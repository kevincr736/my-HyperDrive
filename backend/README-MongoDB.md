# 🗄️ Configuración de MongoDB para HYPERDRIVE

## 📋 Prerrequisitos

1. **MongoDB instalado localmente** o **MongoDB Atlas** (nube)
2. **Node.js** versión 16 o superior

## 🚀 Instalación

### 1. Instalar dependencias:
```bash
npm install
```

### 2. Configurar variables de entorno:
Crear archivo `.env` en la raíz del backend:
```env
MONGODB_URI=mongodb://localhost:27017/hyperdrive
PORT=3000
NODE_ENV=development
```

### 3. Iniciar MongoDB local:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 4. Ejecutar el servidor:
```bash
npm run dev
```

## 🔧 Configuración

### **MongoDB Local:**
- **URI:** `mongodb://localhost:27017/hyperdrive`
- **Puerto:** 27017 (por defecto)
- **Base de datos:** hyperdrive

### **MongoDB Atlas (Nube):**
- **URI:** `mongodb+srv://usuario:password@cluster.mongodb.net/hyperdrive`
- **Reemplazar:** usuario, password y cluster con tus datos

## 📊 Modelos de Datos

### **Car Model:**
```javascript
{
  name: String,           // Nombre del vehículo
  price: String,          // Precio
  maxSpeed: String,       // Velocidad máxima
  category: String,       // Categoría (deportivos, lujosos, etc.)
  image: String,          // URL de la imagen
  description: String,    // Descripción
  specifications: Array,  // Especificaciones técnicas
  carouselImages: Array,  // Imágenes del carrusel
  isFeatured: Boolean,    // Si es destacado
  isActive: Boolean       // Si está activo
}
```

## 🛠️ Uso en el Código

### **Conectar a la base de datos:**
```javascript
const { connectDB, mongoose } = require('./dbserver');
await connectDB();
```

### **Usar modelos:**
```javascript
const Car = require('./models/Car');

// Crear un vehículo
const newCar = new Car({
  name: 'Ferrari SF90',
  price: 'Desde $520.000',
  category: 'deportivos'
});

await newCar.save();
```

## 🔍 Endpoints de Prueba

- **GET /** - Información del servidor
- **GET /cars** - Lista de vehículos
- **GET /health** - Estado del servidor

## 📝 Notas

- La conexión se establece automáticamente al iniciar el servidor
- Se incluye manejo de errores y reconexión automática
- Los modelos incluyen validaciones y métodos útiles
- Se configuran índices para mejorar el rendimiento
