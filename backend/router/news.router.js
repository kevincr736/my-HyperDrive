const express = require('express');
const router = express.Router();

// GET /api/news - Lista todas las noticias
router.get('/', (req, res) => {
  const news = [
    {
      id: 1,
      title: 'Nuevo Lamborghini Revuelto',
      shortDescription: 'El superdeportivo híbrido más potente de la marca italiana',
      fullDescription: 'Lamborghini presenta su nuevo superdeportivo híbrido que combina un motor V12 de combustión con tres motores eléctricos, generando una potencia total de 1,015 CV.',
      date: '2024-01-15',
      image: 'https://placehold.co/400x300/FFD700/000000?text=Lamborghini+Revuelto',
      category: 'superdeportivos'
    },
    {
      id: 2,
      title: 'Ferrari presenta su nuevo V12',
      shortDescription: 'Un motor que combina tradición y tecnología de vanguardia',
      fullDescription: 'Ferrari ha desarrollado un nuevo motor V12 que mantiene la tradición de la marca mientras incorpora las últimas tecnologías en eficiencia y rendimiento.',
      date: '2024-01-10',
      image: 'https://placehold.co/400x300/FF0000/FFFFFF?text=Ferrari+V12',
      category: 'motores'
    }
  ];
  
  res.json({
    success: true,
    data: news,
    count: news.length,
    message: 'Noticias obtenidas correctamente'
  });
});

// GET /api/news/:id - Noticia específica
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const newsId = parseInt(id);
  
  if (isNaN(newsId)) {
    return res.status(400).json({
      success: false,
      message: 'ID de noticia inválido'
    });
  }
  
  res.json({
    success: true,
    data: {
      id: newsId,
      title: 'Noticia de ejemplo',
      description: 'Esta es una noticia de ejemplo',
      date: new Date().toISOString()
    },
    message: 'Noticia obtenida correctamente'
  });
});

module.exports = router;
