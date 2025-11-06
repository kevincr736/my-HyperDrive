const express = require('express');
const router = express.Router();
const News = require('../models/News');
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

// POST /api/news/create - Crear una nueva noticia
router.post('/create', async (req, res) => {
  try {
    const { title, publicationDate, text, imageBase64, imageUrl } = req.body || {};

    // Validar campos requeridos
    if (!title || !text || (!imageBase64 && !imageUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos: title, text, (imageBase64 o imageUrl)'
      });
    }

    // Obtener imagen en base64 (prioridad: imageBase64, luego imageUrl)
    let finalImageBase64;
    if (imageBase64) {
      // Si ya viene en formato data URI base64, devolverlo directamente
      finalImageBase64 = imageBase64.startsWith('data:')
        ? imageBase64
        : `data:image/png;base64,${imageBase64}`;
    } else if (imageUrl) {
      // Convertir URL a base64
      console.log('Convirtiendo imagen URL a base64:', imageUrl);
      finalImageBase64 = await urlToBase64(imageUrl);
      console.log('Imagen base64 generada:', finalImageBase64.substring(0, 50) + '...');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Se requiere imageBase64 o imageUrl'
      });
    }

    // Crear la noticia
    const news = new News({
      title,
      publicationDate: publicationDate ? new Date(publicationDate) : new Date(),
      text,
      image: finalImageBase64,
      isActive: true
    });

    await news.save();

    return res.status(201).json({
      success: true,
      message: 'Noticia creada exitosamente',
      data: {
        id: String(news._id),
        title: news.title,
        publicationDate: news.publicationDate,
        text: news.text,
        image: news.image,
        isActive: news.isActive,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al crear noticia:', error);
    
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
        message: 'Error al obtener la imagen',
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

// GET /api/news - Lista todas las noticias activas
router.get('/', async (req, res) => {
  try {
    const news = await News.findActive();
    
    const newsList = news.map(item => ({
      id: String(item._id),
      title: item.title,
      publicationDate: item.publicationDate,
      text: item.text,
      image: item.image,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return res.status(200).json({
      success: true,
      message: 'Noticias obtenidas correctamente',
      data: newsList,
      count: newsList.length
    });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/news/:id - Obtener noticia específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si es un ObjectId válido de MongoDB
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de noticia inválido'
      });
    }
    
    const news = await News.findById(id);
    
    if (!news || !news.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Noticia no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Noticia obtenida correctamente',
      data: {
        id: String(news._id),
        title: news.title,
        publicationDate: news.publicationDate,
        text: news.text,
        image: news.image,
        isActive: news.isActive,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de noticia inválido'
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
