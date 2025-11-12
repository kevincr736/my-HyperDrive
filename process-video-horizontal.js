/**
 * Script para procesar videos horizontales y ajustarlos (16:9)
 * 
 * Requisitos:
 * - Instalar ffmpeg: https://ffmpeg.org/download.html
 * - Las dependencias están en backend/node_modules
 * 
 * Uso:
 * node process-video-horizontal.js input.mp4 output.mp4
 */

const { processVideoForStories } = require('./backend/utils/videoProcessor');

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error('Uso: node process-video-horizontal.js <input.mp4> <output.mp4>');
  process.exit(1);
}

console.log('🎬 Procesando video horizontal...');
console.log(`📥 Input: ${inputFile}`);
console.log(`📤 Output: ${outputFile}\n`);

// Procesar video horizontal (16:9 aspect ratio)
processVideoForStories(inputFile, outputFile, {
  width: 1280,
  height: 720,
  quality: 23,
  orientation: 'horizontal'
})
  .then(() => {
    console.log(`\n✅ Video procesado exitosamente!`);
    console.log(`📁 Archivo guardado en: ${outputFile}`);
  })
  .catch((err) => {
    console.error('❌ Error al procesar video:', err.message);
    process.exit(1);
  });

