const fs = require('fs');
const path = require('path');
const { processVideoForStories } = require('./backend/utils/videoProcessor');

const inputDir = process.argv[2] || './videos-originales';
const outputDir = process.argv[3] || './videos-procesados';

// Crear directorio de salida si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Obtener todos los archivos de video
const videoFiles = fs.readdirSync(inputDir).filter(file => 
  file.endsWith('.mp4') || file.endsWith('.MP4') || 
  file.endsWith('.mov') || file.endsWith('.MOV') || 
  file.endsWith('.avi') || file.endsWith('.AVI')
);

console.log(`📁 Encontrados ${videoFiles.length} videos para procesar`);
console.log(`📥 Directorio entrada: ${inputDir}`);
console.log(`📤 Directorio salida: ${outputDir}\n`);

// Procesar cada video
async function processAll() {
  let successCount = 0;
  let errorCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < videoFiles.length; i++) {
    const file = videoFiles[i];
    const inputPath = path.join(inputDir, file);
    const outputFileName = `processed-${path.parse(file).name}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);
    
    console.log(`\n[${i + 1}/${videoFiles.length}] Procesando: ${file}`);
    console.log(`⏰ Tiempo transcurrido: ${Math.round((Date.now() - startTime) / 1000 / 60)} minutos`);
    
    try {
      await processVideoForStories(inputPath, outputPath, {
        width: 720,
        height: 1280,
        quality: 28,
        orientation: 'vertical'
      });
      successCount++;
      console.log(`✅ Completado: ${outputFileName}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Error con ${file}:`, error.message);
      // Continuar con el siguiente video
    }
  }
  
  const totalTime = Math.round((Date.now() - startTime) / 1000 / 60);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🎉 ¡Procesamiento completado!`);
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`⏱️  Tiempo total: ${totalTime} minutos`);
  console.log(`📁 Videos guardados en: ${outputDir}`);
  console.log(`${'='.repeat(50)}`);
}

// Verificar que exista el directorio de entrada
if (!fs.existsSync(inputDir)) {
  console.error(`❌ Error: El directorio "${inputDir}" no existe`);
  console.log(`\nUso: node process-videos-batch.js <directorio-entrada> <directorio-salida>`);
  console.log(`Ejemplo: node process-videos-batch.js ./mis-videos ./videos-listos`);
  process.exit(1);
}

// Verificar que haya videos
if (videoFiles.length === 0) {
  console.error(`❌ Error: No se encontraron videos en "${inputDir}"`);
  console.log(`\nFormatos soportados: .mp4, .mov, .avi`);
  process.exit(1);
}

// Iniciar procesamiento
processAll().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});

