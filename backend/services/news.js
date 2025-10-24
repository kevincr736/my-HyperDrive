const express = require('express');
const router = express.Router();

// GET /api/news - Lista todas las noticias
router.get('/', (req, res) => {
  const news = [
    {
      id: 1,
      title: 'Nuevo Lamborghini Revuelto',
      shortDescription: 'El superdeportivo híbrido más potente de la marca italiana',
      fullDescription: 'Lamborghini presenta su nuevo superdeportivo híbrido que combina un motor V12 de combustión con tres motores eléctricos, generando una potencia total de 1,015 CV. El Revuelto representa el futuro de la marca italiana con tecnología de vanguardia y diseño aerodinámico excepcional.',
      date: '2024-01-15',
      image: 'https://placehold.co/400x300/FFD700/000000?text=Lamborghini+Revuelto',
      category: 'superdeportivos'
    },
    {
      id: 2,
      title: 'Ferrari presenta su nuevo V12',
      shortDescription: 'Un motor que combina tradición y tecnología de vanguardia',
      fullDescription: 'Ferrari ha desarrollado un nuevo motor V12 que mantiene la tradición de la marca mientras incorpora las últimas tecnologías en eficiencia y rendimiento. Este motor será la base para los próximos modelos de la gama Ferrari, prometiendo una experiencia de conducción única.',
      date: '2024-01-10',
      image: 'https://placehold.co/400x300/FF0000/FFFFFF?text=Ferrari+V12',
      category: 'motores'
    },
    {
      id: 3,
      title: 'Porsche 911 GT3 RS 2024',
      shortDescription: 'La versión más extrema del 911 llega con mejoras aerodinámicas',
      fullDescription: 'Porsche presenta la nueva versión del 911 GT3 RS con mejoras significativas en aerodinámica y rendimiento. El nuevo modelo incluye un alerón trasero más agresivo, difusores optimizados y un sistema de refrigeración mejorado para track days extremos.',
      date: '2024-01-05',
      image: 'https://placehold.co/400x300/000000/FFFFFF?text=Porsche+GT3',
      category: 'deportivos'
    }
  ];
  
  res.json({
    success: true,
    data: news,
    count: news.length
  });
});

// GET /api/news/:id - Noticia específica
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const newsId = parseInt(id);
  
  const news = [
    {
      id: 1,
      title: 'Nuevo Lamborghini Revuelto',
      shortDescription: 'El superdeportivo híbrido más potente de la marca italiana',
      fullDescription: 'Lamborghini presenta su nuevo superdeportivo híbrido que combina un motor V12 de combustión con tres motores eléctricos, generando una potencia total de 1,015 CV. El Revuelto representa el futuro de la marca italiana con tecnología de vanguardia y diseño aerodinámico excepcional.',
      date: '2024-01-15',
      image: 'https://placehold.co/400x300/FFD700/000000?text=Lamborghini+Revuelto',
      category: 'superdeportivos'
    },
    {
      id: 2,
      title: 'Ferrari presenta su nuevo V12',
      shortDescription: 'Un motor que combina tradición y tecnología de vanguardia',
      fullDescription: 'Ferrari ha desarrollado un nuevo motor V12 que mantiene la tradición de la marca mientras incorpora las últimas tecnologías en eficiencia y rendimiento. Este motor será la base para los próximos modelos de la gama Ferrari, prometiendo una experiencia de conducción única.',
      date: '2024-01-10',
      image: 'https://placehold.co/400x300/FF0000/FFFFFF?text=Ferrari+V12',
      category: 'motores'
    }
  ];
  
  const newsItem = news.find(item => item.id === newsId);
  
  if (!newsItem) {
    return res.status(404).json({
      success: false,
      message: 'Noticia no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: newsItem
  });
});

module.exports = router;
