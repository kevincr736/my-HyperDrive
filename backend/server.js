const app = require('./app');
const { connectDB } = require('./dbserver');

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos y luego iniciar servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor HTTP ejecutándose en puerto ${PORT}`);
      console.log(`📱 URL: http://localhost:${PORT}`);
      console.log(`🗄️ Base de datos: MongoDB conectada`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Cerrando servidor...');
  process.exit(0);
});
