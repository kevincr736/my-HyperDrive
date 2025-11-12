const express = require('express');
const router = express.Router();
const State = require('../models/State');

// POST /api/states/create - Crear un nuevo estado
router.post('/create', async (req, res) => {
  try {
    const { videoUrl, text, description } = req.body || {};

    // Validar campos requeridos
    if (!videoUrl || !text || !description) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos: videoUrl, text, description'
      });
    }

    // Validar que videoUrl sea una URL válida o base64
    const isValidUrl = /^https?:\/\/.+/.test(videoUrl) || videoUrl.startsWith('data:');
    if (!isValidUrl) {
      return res.status(400).json({
        success: false,
        message: 'La URL del video debe ser una URL válida (http:// o https://) o base64 (data:)'
      });
    }

    // Crear el estado
    const state = new State({
      videoUrl,
      text,
      description,
      isActive: true
    });

    await state.save();

    return res.status(201).json({
      success: true,
      message: 'Estado creado exitosamente',
      data: {
        id: String(state._id),
        videoUrl: state.videoUrl,
        text: state.text,
        description: state.description,
        isActive: state.isActive,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al crear estado:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/states - Lista todos los estados activos
router.get('/', async (req, res) => {
  try {
    const states = await State.findActive();
    
    const statesList = states.map(item => ({
      id: String(item._id),
      videoUrl: item.videoUrl,
      text: item.text,
      description: item.description,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return res.status(200).json({
      success: true,
      message: 'Estados obtenidos correctamente',
      data: statesList,
      count: statesList.length
    });
  } catch (error) {
    console.error('Error al obtener estados:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/states/:id - Obtener estado específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si es un ObjectId válido de MongoDB
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de estado inválido'
      });
    }
    
    const state = await State.findById(id);
    
    if (!state || !state.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Estado no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Estado obtenido correctamente',
      data: {
        id: String(state._id),
        videoUrl: state.videoUrl,
        text: state.text,
        description: state.description,
        isActive: state.isActive,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al obtener estado:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de estado inválido'
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

