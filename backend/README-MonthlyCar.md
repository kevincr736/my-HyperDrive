# API de Vehículo Mensual

## Descripción
Esta API permite crear y gestionar un vehículo mensual que se actualiza constantemente. La colección solo mantiene un registro que se actualiza cada vez que se hace una nueva petición.

## Endpoints

### POST /api/cars/create/monthly_car
Crea o actualiza el vehículo mensual con una imagen generada en base64.

**Parámetros del body:**
```json
{
  "name": "Ferrari F8 Tributo",
  "description": "Un superdeportivo italiano con motor V8 biturbo de 720 CV",
  "category": "deportivos",
  "price": "$250,000",
  "maxSpeed": "340 km/h",
  "specifications": [
    {
      "icon": "🚗",
      "title": "Motor",
      "description": "V8 biturbo 3.9L"
    },
    {
      "icon": "⚡",
      "title": "Potencia",
      "description": "720 CV"
    }
  ]
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Vehículo mensual actualizado exitosamente",
  "data": {
    "id": "64f8b2c1a2b3c4d5e6f7g8h9",
    "name": "Ferrari F8 Tributo",
    "description": "Un superdeportivo italiano con motor V8 biturbo de 720 CV",
    "category": "deportivos",
    "price": "$250,000",
    "maxSpeed": "340 km/h",
    "specifications": [...],
    "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

### GET /api/cars/monthly_car
Obtiene el vehículo mensual actual.

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Vehículo mensual obtenido exitosamente",
  "data": {
    "id": "64f8b2c1a2b3c4d5e6f7g8h9",
    "name": "Ferrari F8 Tributo",
    "description": "Un superdeportivo italiano con motor V8 biturbo de 720 CV",
    "category": "deportivos",
    "price": "$250,000",
    "maxSpeed": "340 km/h",
    "specifications": [...],
    "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "createdAt": "2023-09-05T10:00:00.000Z",
    "updatedAt": "2023-09-05T10:30:00.000Z"
  }
}
```

## Características

### Generación de Imagen Base64
- La imagen se genera automáticamente usando Canvas
- Incluye el nombre del vehículo, categoría, precio y velocidad máxima
- Formato: PNG en base64
- Dimensiones: 400x300 píxeles

### Modelo de Datos
- **name**: Nombre del vehículo (requerido)
- **description**: Descripción detallada (requerido)
- **imageBase64**: Imagen generada en base64 (requerido)
- **category**: Categoría del vehículo (deportivos, lujosos, clasicos, todo-terreno)
- **price**: Precio del vehículo (requerido)
- **maxSpeed**: Velocidad máxima (requerido)
- **specifications**: Array de especificaciones técnicas (opcional)
- **isActive**: Estado activo (siempre true)

### Validaciones
- Campos requeridos: name, description, category, price, maxSpeed
- Categorías válidas: deportivos, lujosos, clasicos, todo-terreno
- Máximo 100 caracteres para el nombre
- Máximo 1000 caracteres para la descripción

## Instalación de Dependencias

```bash
npm install canvas
```

## Uso

1. **Crear/Actualizar vehículo mensual:**
```bash
curl -X POST http://localhost:3000/api/cars/create/monthly_car \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lamborghini Huracán",
    "description": "Superdeportivo italiano con motor V10",
    "category": "deportivos",
    "price": "$200,000",
    "maxSpeed": "325 km/h"
  }'
```

2. **Obtener vehículo mensual:**
```bash
curl -X GET http://localhost:3000/api/cars/monthly_car
```

## Notas Importantes

- Solo existe un registro en la colección que se actualiza constantemente
- La imagen se genera automáticamente con la información del vehículo
- El campo `isActive` asegura que solo haya un registro activo
- Los timestamps se actualizan automáticamente
