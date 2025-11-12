# Procesamiento de Videos para Historias

## Problema
Los videos con resoluciones muy altas o aspect ratios incorrectos no se adaptan bien a las historias y solo se ve una esquina.

## Soluciones

### Opción 1: Procesar videos con FFmpeg (Recomendado)

#### 1. Instalar FFmpeg
- **Windows**: Descargar de https://ffmpeg.org/download.html
- **Mac**: `brew install ffmpeg`
- **Linux**: `sudo apt-get install ffmpeg`

#### 2. Instalar dependencia
```bash
npm install fluent-ffmpeg
```

#### 3. Usar los scripts

**Para videos verticales (historias estilo Instagram):**
```bash
node process-video.js input.mp4 output.mp4
```

**Para videos horizontales:**
```bash
node process-video-horizontal.js input.mp4 output.mp4
```

### Opción 2: Comando FFmpeg directo (sin Node.js)

**Video vertical (9:16):**
```bash
ffmpeg -i input.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
```

**Video horizontal (16:9):**
```bash
ffmpeg -i input.mp4 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
```

**Reducir tamaño de video muy grande:**
```bash
ffmpeg -i input.mp4 -vf "scale=720:-1" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k output.mp4
```

### Opción 3: Servicios online (sin instalar nada)

1. **CloudConvert** - https://cloudconvert.com/mp4-converter
   - Subir video
   - Seleccionar formato MP4
   - Ajustar resolución a 1280x720 o 1080x1920

2. **Online Video Converter** - https://www.onlineconverter.com/video-converter
   - Subir video
   - Seleccionar opciones de conversión

### Opción 4: Apps de edición de video

- **DaVinci Resolve** (Gratis): Cambiar aspect ratio y exportar
- **HandBrake** (Gratis): Cambiar resolución y aspect ratio
- **Adobe Premiere**: Si tienes acceso

## Aspect Ratios recomendados

- **Historias verticales**: 9:16 (1080x1920)
- **Videos horizontales**: 16:9 (1280x720 o 1920x1080)
- **Cuadrados**: 1:1 (1080x1080)

## Notas importantes

- ⚠️ **No existe una librería npm que "arregle" videos automáticamente**
- ⚠️ El código de React Native no puede cambiar el contenido del video
- ⚠️ Si el video tiene zoom, debe ser procesado antes de usarlo
- ✅ FFmpeg es la herramienta estándar de la industria para procesamiento de video

## Solución rápida (temporal)

Si necesitas una solución rápida, usa videos con aspect ratio correcto desde el inicio:
- Graba videos en vertical (9:16) para historias
- O busca videos stock en formato correcto

