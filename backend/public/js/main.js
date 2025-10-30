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

// Función para configurar navegación de botones
function setupButtons() {
  console.log('🔍 Buscando botones CATALOGOS y NOTICIAS...');
  
  // Buscar TODOS los elementos posibles que puedan ser botones
  const allElements = document.querySelectorAll('*');
  let foundCatalogos = false;
  let foundNoticias = false;
  
  allElements.forEach(element => {
    const text = element.textContent.trim().toUpperCase();
    const elementTag = element.tagName;
    
    // Detectar elemento CATALOGOS - cualquier elemento que contenga este texto
    if ((text.includes('CATALOGOS') || text.includes('CATÁLOGOS')) && !foundCatalogos) {
      // Verificar que sea un elemento clickable o interactivo
      if (elementTag === 'BUTTON' || 
          elementTag === 'A' || 
          elementTag === 'DIV' ||
          elementTag === 'SPAN' ||
          element.style.cursor === 'pointer' ||
          element.onclick ||
          element.classList.toString().includes('btn') ||
          element.classList.toString().includes('button') ||
          element.getAttribute('role') === 'button') {
        
        console.log('✅ Botón CATALOGOS encontrado:', element);
        
        // Remover listeners existentes si los hay
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        newElement.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('🚀 Navegando a CATALOGOS');
          window.location.href = '/api/cars';
        });
        newElement.style.cursor = 'pointer';
        foundCatalogos = true;
      }
    }
    
    // Detectar elemento NOTICIAS
    if (text.includes('NOTICIAS') && !foundNoticias) {
      // Verificar que sea un elemento clickable o interactivo
      if (elementTag === 'BUTTON' || 
          elementTag === 'A' || 
          elementTag === 'DIV' ||
          elementTag === 'SPAN' ||
          element.style.cursor === 'pointer' ||
          element.onclick ||
          element.classList.toString().includes('btn') ||
          element.classList.toString().includes('button') ||
          element.getAttribute('role') === 'button') {
        
        console.log('✅ Botón NOTICIAS encontrado:', element);
        
        // Remover listeners existentes si los hay
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        newElement.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('🚀 Navegando a NOTICIAS');
          window.location.href = '/api/news';
        });
        newElement.style.cursor = 'pointer';
        foundNoticias = true;
      }
    }
  });
  
  if (!foundCatalogos) {
    console.warn('⚠️ No se encontró el botón CATALOGOS');
  }
  if (!foundNoticias) {
    console.warn('⚠️ No se encontró el botón NOTICIAS');
  }
  
  // También intentar buscar por ID o clases específicas
  const catalogosBtn = document.getElementById('catalogos') || 
                       document.querySelector('.catalogos') ||
                       document.querySelector('[data-action="catalogos"]');
  
  const noticiasBtn = document.getElementById('noticias') || 
                      document.querySelector('.noticias') ||
                      document.querySelector('[data-action="noticias"]');
  
  if (catalogosBtn && !foundCatalogos) {
    catalogosBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '/api/cars';
    });
    catalogosBtn.style.cursor = 'pointer';
    console.log('✅ Botón CATALOGOS configurado por ID/clase');
  }
  
  if (noticiasBtn && !foundNoticias) {
    noticiasBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '/api/news';
    });
    noticiasBtn.style.cursor = 'pointer';
    console.log('✅ Botón NOTICIAS configurado por ID/clase');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 DOM cargado correctamente');
  showServerInfo();
  
  // Intentar configurar botones inmediatamente
  setupButtons();
  
  // También intentar después de un pequeño delay por si los elementos se cargan dinámicamente
  setTimeout(function() {
    setupButtons();
  }, 500);
  
  // Y una vez más después de 1 segundo
  setTimeout(function() {
    setupButtons();
  }, 1000);
});

// También ejecutar cuando la página esté completamente cargada
window.addEventListener('load', function() {
  console.log('📄 Página completamente cargada');
  setupButtons();
});

// Exportar funciones para uso global
window.HyperdriveAPI = {
  showServerInfo,
  makeRequest,
  loadStaticFile
};
