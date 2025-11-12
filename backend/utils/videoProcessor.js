const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

/**
 * Procesa un video para ajustarlo al formato de historias
 * @param {string} inputPath - Ruta del video original
 * @param {string} outputPath - Ruta donde guardar el video procesado
 * @param {object} options - Opciones de procesamiento
 * @returns {Promise<string>} - Ruta del video procesado
 */
function processVideoForStories(inputPath, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      width = 720,        // Ancho (720p para reducir tamaño)
      height = 1280,      // Alto (aspect ratio 9:16)
      quality = 28,       // CRF (0-51, menor = mejor calidad, mayor tamaño)
      orientation = 'vertical' // 'vertical' o 'horizontal'
    } = options;

    let scaleFilter;
    if (orientation === 'vertical') {
      // Para historias verticales (9:16)
      scaleFilter = `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;
    } else {
      // Para videos horizontales (16:9)
      const horWidth = 1280;
      const horHeight = 720;
      scaleFilter = `scale=${horWidth}:${horHeight}:force_original_aspect_ratio=decrease,pad=${horWidth}:${horHeight}:(ow-iw)/2:(oh-ih)/2`;
    }

    console.log(`🎬 Procesando video: ${path.basename(inputPath)}`);

    ffmpeg(inputPath)
      .outputOptions([
        '-vf', scaleFilter,
        '-c:v', 'libx264',
        '-crf', String(quality),
        '-preset', 'medium',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart'
      ])
      .on('start', (commandLine) => {
        console.log('⚙️  FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`⏳ Progreso: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log('✅ Video procesado exitosamente');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('❌ Error al procesar video:', err.message);
        reject(new Error(`Error al procesar video: ${err.message}`));
      })
      .save(outputPath);
  });
}

/**
 * Verifica si FFmpeg está instalado
 * @returns {Promise<boolean>}
 */
function checkFFmpegInstalled() {
  return new Promise((resolve) => {
    ffmpeg.getAvailableFormats((err, formats) => {
      if (err) {
        console.error('❌ FFmpeg no está instalado o no está en el PATH');
        resolve(false);
      } else {
        console.log('✅ FFmpeg está disponible');
        resolve(true);
      }
    });
  });
}

/**
 * Obtiene información del video
 * @param {string} videoPath - Ruta del video
 * @returns {Promise<object>}
 */
function getVideoInfo(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        resolve({
          duration: metadata.format.duration,
          width: videoStream?.width,
          height: videoStream?.height,
          codec: videoStream?.codec_name,
          bitrate: metadata.format.bit_rate,
          size: metadata.format.size
        });
      }
    });
  });
}

module.exports = {
  processVideoForStories,
  checkFFmpegInstalled,
  getVideoInfo
};

