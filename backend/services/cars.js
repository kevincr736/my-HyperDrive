const express = require('express');
const router = express.Router();
const MonthlyCar = require('../models/MonthlyCar');
const https = require('https');
const http = require('http');

// Función para convertir URL de imagen a base64
const urlToBase64 = (url) => {
  return new Promise((resolve, reject) => {
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

module.exports = router;
