/**
 * Script para procesar videos y ajustarlos para historias
 * 
 * Requisitos:
 * - Instalar ffmpeg: https://ffmpeg.org/download.html
 * - Las dependencias están en backend/node_modules
 * 
 * Uso:
 * node process-video.js input.mp4 output.mp4
 */

const { processVideoForStories } = require('./backend/utils/videoProcessor');
const path = require('path');

// Obtener argumentos
const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error('Uso: node process-video.js <input.mp4> <output.mp4>');
  process.exit(1);
}

console.log('🎬 Procesando video...');
console.log(`📥 Input: ${inputFile}`);
console.log(`📤 Output: ${outputFile}\n`);

// Procesar video para historias verticales (9:16 aspect ratio)
// Resoluciones recomendadas:
// - 720x1280 (HD) - Recomendado: archivos más pequeños, buena calidad
// - 1080x1920 (Full HD) - Alta calidad, archivos más grandes
// - 1440x2560 (2K) - Máxima calidad, archivos muy grandes
processVideoForStories(inputFile, outputFile, {
  width: 720,        // Cambiar a 1080 para Full HD o 1440 para 2K
  height: 1280,    // Cambiar a 1920 para Full HD o 2560 para 2K
  quality: 23,     // 18-23: Alta calidad | 24-28: Media (recomendado) | 29-35: Baja
  orientation: 'vertical'
})
  .then(() => {
    console.log(`\n✅ Video procesado exitosamente!`);
    console.log(`📁 Archivo guardado en: ${outputFile}`);
  })
  .catch((err) => {
    console.error('❌ Error al procesar video:', err.message);
    process.exit(1);
  });

