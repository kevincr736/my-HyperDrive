# Guía de Videos para Historias - Solución Frontend

## Problema
Tienes muchos videos y algunos se ven con zoom/solo se ve una esquina.

## Soluciones Prácticas

### ✅ Solución 1: Acepta ambos modos (Recomendado para muchos videos)

El código actual usa `ResizeMode.CONTAIN` que muestra el video completo (puede tener barras negras).

**Ventajas:**
- ✅ Funciona con cualquier video
- ✅ No necesitas procesar nada
- ✅ Se ve el video completo

**Desventajas:**
- ❌ Puede tener barras negras a los lados

**Para cambiar a COVER (llena la pantalla, puede recortar):**
En `my-hyperdrive/src/screens/NewsScreen.js` línea 365:
```javascript
resizeMode={ResizeMode.COVER}  // Llena la pantalla, puede recortar
```

---

### ✅ Solución 2: Procesar videos en lote ANTES de usar

Si quieres que todos se vean perfecto, procesa todos tus videos una sola vez:

#### Paso 1: Instalar FFmpeg
Ver archivo `backend/FFMPEG-SETUP.md`

#### Paso 2: Procesar videos en lote

**Opción A: Script de Node.js**
```bash
# Procesar todos los videos de una carpeta
node process-videos-batch.js ./mis-videos ./videos-procesados
```

**Opción B: Comando directo**
```bash
# Para cada video:
ffmpeg -i video-original.mp4 -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 28 video-procesado.mp4
```

---

### ✅ Solución 3: Guía para usuarios (Prevención)

Crea una guía para que los usuarios suban videos correctos:

**Formatos recomendados:**
- 📱 **Vertical (Historias)**: 9:16 ratio (ej: 720x1280, 1080x1920)
- 📺 **Horizontal**: 16:9 ratio (ej: 1280x720, 1920x1080)
- ⚠️ Evitar videos con zoom pre-aplicado

---

### ✅ Solución 4: Dos modos en el frontend

Permite al usuario elegir cómo ver el video:

```javascript
// Agregar botón para cambiar modo
const [videoMode, setVideoMode] = useState('contain'); // 'contain' o 'cover'

// En el Video component:
resizeMode={videoMode === 'contain' ? ResizeMode.CONTAIN : ResizeMode.COVER}

// Botón para cambiar
<TouchableOpacity onPress={() => setVideoMode(videoMode === 'contain' ? 'cover' : 'contain')}>
  <MaterialIcons name="aspect-ratio" size={24} color="#FFF" />
</TouchableOpacity>
```

---

## Comparación de Modos

| Modo | Pros | Contras | Cuándo usar |
|------|------|---------|-------------|
| **CONTAIN** | ✅ Video completo<br>✅ Sin recortes | ❌ Barras negras | Videos con diferentes tamaños |
| **COVER** | ✅ Llena pantalla<br>✅ Sin barras | ❌ Puede recortar | Videos con aspect ratio correcto |
| **STRETCH** | ✅ Llena pantalla | ❌ Distorsiona imagen | Casi nunca recomendado |

---

## Recomendación Final

**Para muchos videos sin procesar:**
1. Usa `ResizeMode.CONTAIN` (actual)
2. Acepta que algunos tendrán barras negras
3. Crea una guía para futuros videos

**Para calidad perfecta:**
1. Procesa todos los videos una sola vez con FFmpeg
2. Usa el script de procesamiento en lote
3. Sube los videos procesados

---

## Script de Procesamiento en Lote

Crea un archivo `process-videos-batch.js`:

\`\`\`javascript
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
  file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi')
);

console.log(\`📁 Encontrados \${videoFiles.length} videos para procesar\`);

// Procesar cada video
async function processAll() {
  for (let i = 0; i < videoFiles.length; i++) {
    const file = videoFiles[i];
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, \`processed-\${file}\`);
    
    console.log(\`\\n[\${i + 1}/\${videoFiles.length}] Procesando: \${file}\`);
    
    try {
      await processVideoForStories(inputPath, outputPath, {
        width: 720,
        height: 1280,
        quality: 28,
        orientation: 'vertical'
      });
      console.log(\`✅ Completado: \${file}\`);
    } catch (error) {
      console.error(\`❌ Error con \${file}:\`, error.message);
    }
  }
  
  console.log(\`\\n🎉 ¡Procesamiento completado!\`);
}

processAll();
\`\`\`

**Uso:**
\`\`\`bash
node process-videos-batch.js ./carpeta-videos-originales ./carpeta-videos-listos
\`\`\`

---

## ¿Qué hacer ahora?

1. **Si tienes < 10 videos**: Procésalos manualmente con CloudConvert
2. **Si tienes 10-50 videos**: Usa el script en lote (toma ~5 min por video)
3. **Si tienes > 50 videos**: Usa CONTAIN mode y acepta las barras negras

**La realidad**: No hay magia. O procesas los videos o aceptas que algunos se vean con barras/recortados.

