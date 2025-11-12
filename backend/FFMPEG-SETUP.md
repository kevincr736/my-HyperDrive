# Instalación de FFmpeg

Para que el procesamiento automático de videos funcione, necesitas instalar FFmpeg en tu sistema.

## Windows

### Opción 1: Usar Chocolatey (Recomendado)
```powershell
# Instalar Chocolatey si no lo tienes
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar FFmpeg
choco install ffmpeg
```

### Opción 2: Instalación manual
1. Descargar FFmpeg de: https://www.gyan.dev/ffmpeg/builds/
2. Descargar "ffmpeg-release-essentials.zip"
3. Extraer el archivo
4. Copiar la carpeta `bin` a `C:\ffmpeg\bin`
5. Agregar al PATH:
   - Buscar "Variables de entorno" en Windows
   - Editar la variable "Path"
   - Agregar `C:\ffmpeg\bin`
6. Reiniciar terminal y verificar: `ffmpeg -version`

## Mac

```bash
brew install ffmpeg
```

## Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install ffmpeg
```

## Verificar instalación

```bash
ffmpeg -version
```

Deberías ver la versión de FFmpeg instalada.

## Usar sin FFmpeg (Alternativa)

Si no quieres instalar FFmpeg, puedes:
1. Procesar los videos manualmente antes de subirlos
2. Usar servicios online como CloudConvert
3. Desactivar el procesamiento automático en el código

