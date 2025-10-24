# API - Conversión de URL a Base64

## Endpoint: POST /api/cars/create/monthly_car

Ahora el API puede recibir una URL de imagen y la convierte automáticamente a base64.

### Parámetros:
- `name`: Nombre del vehículo
- `description`: Descripción del vehículo  
- `imageUrl`: URL de la imagen (se convierte automáticamente a base64)

### Ejemplo de uso:

```bash
curl -X POST "http://localhost:3000/cars/create/monthly_car?name=Ferrari%20F8&description=Superdeportivo%20italiano&imageUrl=https://example.com/ferrari.jpg"
```

### Ejemplo con imagen de Unsplash:

```bash
curl -X POST "http://localhost:3000/cars/create/monthly_car?name=Lamborghini%20Huracan&description=Superdeportivo%20italiano&imageUrl=https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800"
```

### Respuesta exitosa:

```json
{
  "success": true,
  "message": "Vehículo mensual creado/actualizado exitosamente",
  "data": {
    "id": "68fbeb358c7dc62a2e25ba4c",
    "name": "Ferrari F8",
    "description": "Superdeportivo italiano",
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
    "category": "deportivos",
    "price": "$0",
    "maxSpeed": "0 km/h",
    "specifications": [],
    "createdAt": "2025-10-24T21:10:13.325Z",
    "updatedAt": "2025-10-24T21:16:38.942Z"
  }
}
```

### Ventajas:

1. **Más fácil**: Solo necesitas la URL de la imagen
2. **Automático**: El API convierte la URL a base64
3. **Flexible**: Funciona con cualquier URL de imagen
4. **Eficiente**: No necesitas procesar la imagen manualmente

### URLs de ejemplo que funcionan:

- Unsplash: `https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800`
- Pexels: `https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg`
- Cualquier URL de imagen pública
