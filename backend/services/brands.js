const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
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

// POST /api/brands/create - Crear una nueva marca
router.post('/create', async (req, res) => {
  try {
    const { name, description, timeline, logoBase64, logoUrl, carImageBase64, carImageUrl } = req.body || {};

    // Validar campos requeridos
    if (!name || !description || !timeline || (!logoBase64 && !logoUrl) || (!carImageBase64 && !carImageUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos: name, description, timeline, (logoBase64 o logoUrl) y (carImageBase64 o carImageUrl)'
      });
    }

    // Validar que timeline sea un array
    if (!Array.isArray(timeline) || timeline.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Timeline debe ser un array con al menos un evento'
      });
    }

    // Validar cada evento del timeline
    for (const event of timeline) {
      if (!event.year || !event.title || !event.description) {
        return res.status(400).json({
          success: false,
          message: 'Cada evento del timeline debe tener: year, title y description'
        });
      }
    }

    // Obtener logo en base64 (prioridad: logoBase64, luego logoUrl)
    let finalLogoBase64;
    if (logoBase64) {
      // Si ya viene en formato data URI base64, devolverlo directamente
      finalLogoBase64 = logoBase64.startsWith('data:')
        ? logoBase64
        : `data:image/png;base64,${logoBase64}`;
    } else if (logoUrl) {
      // Convertir URL a base64
      console.log('Convirtiendo logo URL a base64:', logoUrl);
      finalLogoBase64 = await urlToBase64(logoUrl);
      console.log('Logo base64 generado:', finalLogoBase64.substring(0, 50) + '...');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Se requiere logoBase64 o logoUrl'
      });
    }

    // Obtener imagen del carro en base64 (prioridad: carImageBase64, luego carImageUrl)
    let finalCarImageBase64;
    if (carImageBase64) {
      // Si ya viene en formato data URI base64, devolverlo directamente
      finalCarImageBase64 = carImageBase64.startsWith('data:')
        ? carImageBase64
        : `data:image/png;base64,${carImageBase64}`;
    } else if (carImageUrl) {
      // Convertir URL a base64
      console.log('Convirtiendo imagen de carro URL a base64:', carImageUrl);
      finalCarImageBase64 = await urlToBase64(carImageUrl);
      console.log('Imagen de carro base64 generado:', finalCarImageBase64.substring(0, 50) + '...');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Se requiere carImageBase64 o carImageUrl'
      });
    }

    // Crear la marca
    const brand = new Brand({
      name,
      description,
      timeline,
      logo: finalLogoBase64,
      carImage: finalCarImageBase64,
      isActive: true
    });

    await brand.save();

    // Ordenar timeline por año
    const orderedTimeline = brand.getOrderedTimeline();

    return res.status(201).json({
      success: true,
      message: 'Marca creada exitosamente',
      data: {
        id: String(brand._id),
        name: brand.name,
        description: brand.description,
        timeline: orderedTimeline,
        logo: brand.logo,
        carImage: brand.carImage,
        isActive: brand.isActive,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al crear marca:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors
      });
    }

    // Manejar error de duplicado (nombre único)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una marca con este nombre'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/brands - Lista todas las marcas activas
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.findActive();
    
    const brandsWithTimeline = brands.map(brand => ({
      id: String(brand._id),
      name: brand.name,
      description: brand.description,
      timeline: brand.getOrderedTimeline(),
      logo: brand.logo,
      carImage: brand.carImage,
      isActive: brand.isActive,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt
    }));

    return res.status(200).json({
      success: true,
      message: 'Marcas obtenidas correctamente',
      data: brandsWithTimeline,
      count: brandsWithTimeline.length
    });
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/brands/name/:name - Obtener marca por nombre
router.get('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    // Buscar por nombre (case-insensitive)
    const brand = await Brand.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      isActive: true 
    });
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Marca no encontrada'
      });
    }

    const orderedTimeline = brand.getOrderedTimeline();
    
    return res.status(200).json({
      success: true,
      message: 'Marca obtenida correctamente',
      data: {
        id: String(brand._id),
        name: brand.name,
        description: brand.description,
        timeline: orderedTimeline,
        logo: brand.logo,
        carImage: brand.carImage,
        isActive: brand.isActive,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al obtener marca por nombre:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/brands/:id - Obtener marca específica por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si es un ObjectId válido de MongoDB
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de marca inválido'
      });
    }
    
    const brand = await Brand.findById(id);
    
    if (!brand || !brand.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Marca no encontrada'
      });
    }

    const orderedTimeline = brand.getOrderedTimeline();
    
    return res.status(200).json({
      success: true,
      message: 'Marca obtenida correctamente',
      data: {
        id: String(brand._id),
        name: brand.name,
        description: brand.description,
        timeline: orderedTimeline,
        logo: brand.logo,
        carImage: brand.carImage,
        isActive: brand.isActive,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al obtener marca:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de marca inválido'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
