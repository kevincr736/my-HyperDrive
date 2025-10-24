// HYPERDRIVE - JavaScript principal
console.log('🚀 HYPERDRIVE - Servidor HTTP cargado');

// Función para mostrar información del servidor
function showServerInfo() {
  const info = {
    server: 'HYPERDRIVE HTTP Server',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  };
  
  console.log('📊 Información del servidor:', info);
  return info;
}

// Función para hacer peticiones al servidor
async function makeRequest(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('✅ Respuesta del servidor:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en la petición:', error);
    return null;
  }
}

// Función para cargar archivos estáticos
function loadStaticFile(filename) {
  return `/public/${filename}`;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 DOM cargado correctamente');
  showServerInfo();
});

// Exportar funciones para uso global
window.HyperdriveAPI = {
  showServerInfo,
  makeRequest,
  loadStaticFile
};
