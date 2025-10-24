const mongoose = require('mongoose');

// Configuración de la base de datos
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hyperdrive';

// Opciones de conexión
const options = {
  maxPoolSize: 10, // Mantener hasta 10 conexiones en el pool
  serverSelectionTimeoutMS: 5000, // Mantener intentando enviar operaciones por 5 segundos
  socketTimeoutMS: 45000, // Cerrar sockets después de 45 segundos de inactividad
};

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    
    const conn = await mongoose.connect(MONGODB_URI, options);
    
    console.log(`✅ MongoDB conectado exitosamente: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🌐 Puerto: ${conn.connection.port}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Función para desconectar de MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB desconectado exitosamente');
  } catch (error) {
    console.error('❌ Error desconectando de MongoDB:', error.message);
  }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose desconectado de MongoDB');
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  disconnectDB,
  mongoose
};
