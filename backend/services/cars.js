const express = require('express');
const router = express.Router();
const MonthlyCar = require('../models/MonthlyCar');
const Car = require('../models/Car');
const https = require('https');
const http = require('http');

// Función para convertir URL de imagen a base64 (o retornar si ya es base64)
const urlToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    // Si ya viene en formato data URI base64, devolverlo directamente
    if (typeof url === 'string' && url.startsWith('data:')) {
      return resolve(url);
    }

    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Error al descargar imagen: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const mimeType = response.headers['content-type'] || 'image/jpeg';
        const dataUri = `data:${mimeType};base64,${base64}`;
        resolve(dataUri);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

// POST /api/cars/create/monthly_car - Crear/actualizar vehículo mensual
router.post('/create/monthly_car', async (req, res) => {
  try {
    // Obtener parámetros de query string
    const { name, description, imageUrl } = req.query;

    // Validar campos requeridos
    if (!name || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos: name, description, imageUrl'
      });
    }

    // Convertir URL a base64
    console.log('Convirtiendo URL a base64:', imageUrl);
    const imageBase64 = await urlToBase64(imageUrl);
    console.log('Base64 generado:', imageBase64.substring(0, 50) + '...');

    // Preparar datos para actualizar
    const updateData = {
      name,
      description,
      imageBase64,
      category: 'deportivos', // Valor por defecto
      price: '$0', // Valor por defecto
      maxSpeed: '0 km/h', // Valor por defecto
      specifications: [],
      isActive: true
    };

    // Actualizar o crear el vehículo mensual
    const monthlyCar = await MonthlyCar.updateMonthlyCar(updateData);

    res.status(200).json({
      success: true,
      message: 'Vehículo mensual actualizado exitosamente',
      data: {
        id: monthlyCar._id,
        name: monthlyCar.name,
        description: monthlyCar.description,
        category: monthlyCar.category,
        price: monthlyCar.price,
        maxSpeed: monthlyCar.maxSpeed,
        specifications: monthlyCar.specifications,
        imageBase64: monthlyCar.imageBase64,
        updatedAt: monthlyCar.updatedAt
      }
    });

  } catch (error) {
    console.error('Error al crear/actualizar vehículo mensual:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/cars/monthly_car - Obtener vehículo mensual actual
router.get('/monthly_car', async (req, res) => {
  try {
    const monthlyCar = await MonthlyCar.getOrCreateMonthlyCar();

    res.status(200).json({
      success: true,
      message: 'Vehículo mensual obtenido exitosamente',
      data: {
        id: monthlyCar._id,
        name: monthlyCar.name,
        description: monthlyCar.description,
        category: monthlyCar.category,
        price: monthlyCar.price,
        maxSpeed: monthlyCar.maxSpeed,
        specifications: monthlyCar.specifications,
        imageBase64: monthlyCar.imageBase64,
        createdAt: monthlyCar.createdAt,
        updatedAt: monthlyCar.updatedAt
      }
    });

  } catch (error) {
    console.error('Error al obtener vehículo mensual:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/cars/update/monthly_car - Actualizar vehículo mensual existente (temporal)
router.post('/update/monthly_car', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.query;

    if (!name || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos: name, description, imageUrl'
      });
    }

    // Buscar el registro existente y actualizarlo
    const monthlyCar = await MonthlyCar.findOne({ isActive: true });
    
    if (!monthlyCar) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró vehículo mensual activo'
      });
    }

    // Actualizar los campos
    monthlyCar.name = name;
    monthlyCar.description = description;
    monthlyCar.imageUrl = imageUrl;
    await monthlyCar.save();

    res.status(200).json({
      success: true,
      message: 'Vehículo mensual actualizado exitosamente',
      data: {
        id: monthlyCar._id,
        name: monthlyCar.name,
        description: monthlyCar.description,
        imageUrl: monthlyCar.imageUrl,
        category: monthlyCar.category,
        price: monthlyCar.price,
        maxSpeed: monthlyCar.maxSpeed,
        specifications: monthlyCar.specifications,
        createdAt: monthlyCar.createdAt,
        updatedAt: monthlyCar.updatedAt
      }
    });

  } catch (error) {
    console.error('Error al actualizar vehículo mensual:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /cars/create/featured - Crea una tarjeta destacada (MODELOS)
// Acepta imageBase64 (data URI) o imageUrl (se convertirá a base64)
router.post('/create/featured', async (req, res) => {
  try {
    const { name, price, maxSpeed, category, imageBase64, imageUrl, description } = req.body || {};

    if (!name || !price || !maxSpeed || !category || (!imageBase64 && !imageUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos: name, price, maxSpeed, category y (imageBase64 o imageUrl)'
      });
    }

    // Validar categoría
    const validCategories = ['deportivos', 'lujosos', 'clasicos', 'todo-terreno'];
    const finalCategory = String(category).toLowerCase();
    
    if (!validCategories.includes(finalCategory)) {
      return res.status(400).json({
        success: false,
        message: `Categoría inválida. Las categorías válidas son: ${validCategories.join(', ')}`
      });
    }

    // Obtener base64 final a partir de imageBase64 o imageUrl
    let finalBase64;
    if (imageBase64) {
      // Si no incluye prefijo data:, agregar uno genérico
      finalBase64 = imageBase64.startsWith('data:')
        ? imageBase64
        : `data:image/png;base64,${imageBase64}`;
    } else {
      finalBase64 = await urlToBase64(imageUrl);
    }

    // Guardar en el campo image como string (puede ser data URI)
    const car = new Car({
      name,
      price,
      maxSpeed,
      category: finalCategory,
      image: finalBase64, // almacenamos base64 en el mismo campo string
      description: description || '',
      isFeatured: true,
      isActive: true,
      specifications: []
    });

    await car.save();

    return res.status(201).json({
      success: true,
      message: 'Tarjeta destacada creada exitosamente',
      data: {
        id: String(car._id),
        title: car.name,
        price: car.price,
        imageBase64: car.image,
        category: car.category
      }
    });
  } catch (error) {
    console.error('Error al crear tarjeta destacada:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/cars/home_models - Modelos para la sección MODELOS del Home
router.get('/home_models', async (req, res) => {
  try {
    // 1) Buscar vehículos destacados activos
    const featured = await Car.findFeatured();

    let models;
    if (featured && featured.length > 0) {
      // Convertir imágenes a Base64 al vuelo y mapear al formato esperado
      const limited = featured.slice(0, 8);
      models = await Promise.all(limited.map(async (car) => {
        try {
          const imageBase64 = await urlToBase64(car.image);
          return {
            id: String(car._id),
            title: car.name,
            price: car.price,
            imageBase64,
            category: car.category
          };
        } catch (err) {
          // Si falla la conversión, devolver un placeholder minimal en base64
          const placeholderBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh7j4VQAAAABJRU5ErkJggg==';
          return {
            id: String(car._id),
            title: car.name,
            price: car.price,
            imageBase64: placeholderBase64,
            category: car.category
          };
        }
      }));
    } else {
      // 2) Fallback por defecto (4 tarjetas) si no hay destacados en BD
      const placeholderBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh7j4VQAAAABJRU5ErkJggg==';
      models = [
        { id: 'd1', title: 'Lamborghini Revuelto', price: 'FROM $700.000', imageBase64: placeholderBase64 },
        { id: 'd2', title: 'Ford Mustang',          price: 'FROM $300.000', imageBase64: placeholderBase64 },
        { id: 'd3', title: 'Ferrari 296 GTB',       price: 'FROM $320.000', imageBase64: placeholderBase64 },
        { id: 'd4', title: 'Porsche 911',           price: 'FROM $120.000', imageBase64: placeholderBase64 },
      ];
    }

    return res.status(200).json({
      success: true,
      message: 'Modelos para home obtenidos correctamente',
      data: models
    });
  } catch (error) {
    console.error('Error al obtener modelos para home:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/cars - Obtener carros filtrados por categoría
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    // Validar categoría si se proporciona
    const validCategories = ['deportivos', 'lujosos', 'clasicos', 'todo-terreno'];
    
    let cars;
    if (category) {
      const finalCategory = String(category).toLowerCase();
      
      if (!validCategories.includes(finalCategory)) {
        return res.status(400).json({
          success: false,
          message: `Categoría inválida. Las categorías válidas son: ${validCategories.join(', ')}`
        });
      }

      // Buscar carros por categoría
      cars = await Car.findByCategory(finalCategory);
    } else {
      // Si no se proporciona categoría, devolver todos los carros activos
      cars = await Car.find({ isActive: true });
    }

    // Convertir imágenes a Base64 y mapear al formato esperado
    const carsWithImages = await Promise.all(cars.map(async (car) => {
      try {
        const imageBase64 = await urlToBase64(car.image);
        return {
          id: String(car._id),
          name: car.name,
          price: car.price,
          maxSpeed: car.maxSpeed,
          category: car.category,
          description: car.description,
          imageBase64,
          isFeatured: car.isFeatured,
          specifications: car.specifications,
          createdAt: car.createdAt,
          updatedAt: car.updatedAt
        };
      } catch (err) {
        // Si falla la conversión, devolver un placeholder minimal en base64
        const placeholderBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh7j4VQAAAABJRU5ErkJggg==';
        return {
          id: String(car._id),
          name: car.name,
          price: car.price,
          maxSpeed: car.maxSpeed,
          category: car.category,
          description: car.description,
          imageBase64: placeholderBase64,
          isFeatured: car.isFeatured,
          specifications: car.specifications,
          createdAt: car.createdAt,
          updatedAt: car.updatedAt
        };
      }
    }));

    return res.status(200).json({
      success: true,
      message: category 
        ? `Carros de la categoría "${category}" obtenidos correctamente`
        : 'Todos los carros obtenidos correctamente',
      data: carsWithImages,
      count: carsWithImages.length
    });
  } catch (error) {
    console.error('Error al obtener carros:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
