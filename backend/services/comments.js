const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
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
        reject(new Error(`No se pudo descargar la imagen desde ${url}. Error ${response.statusCode}: ${response.statusCode === 404 ? 'Imagen no encontrada' : 'Error del servidor'}`));
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
      reject(new Error(`Error al conectar con ${url}: ${error.message}`));
    });
  });
};

// POST /api/comments/create - Crear un nuevo comentario
router.post('/create', async (req, res) => {
  try {
    const { text, date, category, avatarBase64, avatarUrl } = req.body || {};

    // Validar campos requeridos
    if (!text || !category || (!avatarBase64 && !avatarUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos: text, category, (avatarBase64 o avatarUrl)'
      });
    }

    // Obtener avatar en base64 (prioridad: avatarBase64, luego avatarUrl)
    let finalAvatarBase64;
    if (avatarBase64) {
      // Si ya viene en formato data URI base64, devolverlo directamente
      finalAvatarBase64 = avatarBase64.startsWith('data:')
        ? avatarBase64
        : `data:image/png;base64,${avatarBase64}`;
    } else if (avatarUrl) {
      // Convertir URL a base64
      console.log('Convirtiendo avatar URL a base64:', avatarUrl);
      finalAvatarBase64 = await urlToBase64(avatarUrl);
      console.log('Avatar base64 generado:', finalAvatarBase64.substring(0, 50) + '...');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Se requiere avatarBase64 o avatarUrl'
      });
    }

    // Crear el comentario
    const comment = new Comment({
      text,
      date: date ? new Date(date) : new Date(),
      category,
      avatar: finalAvatarBase64,
      isActive: true
    });

    await comment.save();

    return res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      data: {
        id: String(comment._id),
        text: comment.text,
        date: comment.date,
        category: comment.category,
        avatar: comment.avatar,
        isActive: comment.isActive,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors
      });
    }

    // Manejar errores de descarga de imagen (URL incorrecta o imagen no encontrada)
    if (error.message.includes('descargar la imagen') || error.message.includes('conectar con')) {
      return res.status(400).json({
        success: false,
        message: 'Error al obtener el avatar',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/comments - Lista todos los comentarios activos
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let comments;
    if (category) {
      // Filtrar por categoría si se proporciona
      comments = await Comment.findByCategory(category);
    } else {
      // Obtener todos los comentarios activos
      comments = await Comment.findActive();
    }
    
    const commentsList = comments.map(item => ({
      id: String(item._id),
      text: item.text,
      date: item.date,
      category: item.category,
      avatar: item.avatar,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return res.status(200).json({
      success: true,
      message: 'Comentarios obtenidos correctamente',
      data: commentsList,
      count: commentsList.length
    });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;

