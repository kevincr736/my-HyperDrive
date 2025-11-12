# 🎬 Guía del Procesador de Video

## ¿Cómo funciona?

El procesador de video usa **FFmpeg** para:
- ✅ Redimensionar videos al formato de historias (9:16 vertical o 16:9 horizontal)
- ✅ Comprimir videos para reducir el tamaño de archivo
- ✅ Ajustar calidad (CRF: 0-51, menor = mejor calidad)
- ✅ Mantener el aspecto original con barras negras si es necesario

## 📋 Requisitos

### 1. Instalar FFmpeg

**En Windows:**
```powershell
# Opción 1: Con winget (Windows 10/11)
winget install ffmpeg

# Opción 2: Con chocolatey
choco install ffmpeg

# Opción 3: Descarga manual
# 1. Ve a https://ffmpeg.org/download.html
# 2. Descarga la versión para Windows
# 3. Extrae y agrega la carpeta "bin" al PATH del sistema
```

**Verificar instalación:**
```bash
ffmpeg -version
```

### 2. Instalar dependencias Node.js
```bash
cd backend
npm install
```

## 🚀 Cómo usar

### Opción 1: Procesar un solo video (vertical 9:16)
```bash
node process-video.js input.mp4 output.mp4
```

### Opción 2: Procesar un video horizontal (16:9)
```bash
node process-video-horizontal.js input.mp4 output.mp4
```

### Opción 3: Procesar múltiples videos en lote ⭐ (Recomendado)
```bash
# Crear carpetas
mkdir videos-originales
mkdir videos-procesados

# Copiar tus videos a videos-originales

# Procesar todos
node process-videos-batch.js ./videos-originales ./videos-procesados
```

### Opción 4: Usar en código JavaScript
```javascript
const { processVideoForStories } = require('./backend/utils/videoProcessor');

// Procesar video vertical
await processVideoForStories('input.mp4', 'output.mp4', {
  width: 720,
  height: 1280,
  quality: 28,        // 0-51, menor = mejor calidad
  orientation: 'vertical'
});

// Procesar video horizontal
await processVideoForStories('input.mp4', 'output.mp4', {
  width: 1280,
  height: 720,
  quality: 28,
  orientation: 'horizontal'
});
```

## ⚙️ Opciones de configuración

| Parámetro | Descripción | Valores |
|-----------|-------------|---------|
| `width` | Ancho del video | 720 (vertical), 1280 (horizontal) |
| `height` | Alto del video | 1280 (vertical), 720 (horizontal) |
| `quality` | Calidad (CRF) | 0-51 (menor = mejor calidad, mayor tamaño) |
| `orientation` | Orientación | `'vertical'` o `'horizontal'` |

**Recomendaciones de calidad:**
- `18-23`: Alta calidad (archivos grandes)
- `24-28`: Calidad media (recomendado) ⭐
- `29-35`: Calidad baja (archivos pequeños)

## 🧪 Verificar instalación

Ejecuta el script de prueba:
```bash
node test-video-processor.js
```

## 📝 Ejemplo completo

```bash
# 1. Verificar que FFmpeg está instalado
node test-video-processor.js

# 2. Procesar un video de prueba
node process-video.js mi-video.mp4 mi-video-procesado.mp4

# 3. O procesar múltiples videos
node process-videos-batch.js ./mis-videos ./videos-listos
```

## ❓ Solución de problemas

**Error: "FFmpeg no está instalado"**
- Instala FFmpeg siguiendo los pasos arriba
- Reinicia la terminal después de instalar
- Verifica que está en el PATH: `ffmpeg -version`

**Error: "No se encontraron videos"**
- Verifica que los archivos tienen extensión: `.mp4`, `.mov`, `.avi`
- Verifica que la ruta del directorio es correcta

**El video tarda mucho en procesarse**
- Es normal, puede tomar varios minutos por video
- El tiempo depende del tamaño y duración del video original

