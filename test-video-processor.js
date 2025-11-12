/**
 * Script de prueba para verificar el procesador de video
 * 
 * Este script verifica si FFmpeg está instalado y muestra cómo usar el procesador
 */

const { checkFFmpegInstalled, getVideoInfo, processVideoForStories } = require('./backend/utils/videoProcessor');
const path = require('path');

async function testVideoProcessor() {
  console.log('🔍 Verificando instalación de FFmpeg...\n');
  
  const isInstalled = await checkFFmpegInstalled();
  
  if (!isInstalled) {
    console.log('\n❌ FFmpeg no está instalado o no está en el PATH');
    console.log('\n📥 Para instalar FFmpeg en Windows:');
    console.log('   1. Descarga desde: https://ffmpeg.org/download.html');
    console.log('   2. O usa chocolatey: choco install ffmpeg');
    console.log('   3. O usa winget: winget install ffmpeg');
    console.log('   4. Asegúrate de agregar FFmpeg al PATH del sistema');
    return;
  }
  
  console.log('\n✅ FFmpeg está instalado correctamente\n');
  console.log('📖 Ejemplos de uso:\n');
  
  console.log('1️⃣  Procesar un video vertical (9:16):');
  console.log('   node process-video.js input.mp4 output.mp4\n');
  
  console.log('2️⃣  Procesar un video horizontal (16:9):');
  console.log('   node process-video-horizontal.js input.mp4 output.mp4\n');
  
  console.log('3️⃣  Procesar múltiples videos:');
  console.log('   node process-videos-batch.js ./videos-originales ./videos-procesados\n');
  
  console.log('4️⃣  Usar el módulo directamente en código:');
  console.log(`
   const { processVideoForStories } = require('./backend/utils/videoProcessor');
   
   await processVideoForStories('input.mp4', 'output.mp4', {
     width: 720,
     height: 1280,
     quality: 28,
     orientation: 'vertical'
   });
  `);
}

// Ejecutar prueba
testVideoProcessor().catch(console.error);

