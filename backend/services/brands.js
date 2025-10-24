const express = require('express');
const router = express.Router();

// GET /api/brands - Lista todas las marcas
router.get('/', (req, res) => {
  const brands = [
    {
      id: 1,
      name: 'Ferrari',
      logo: 'https://placehold.co/120x120/FF0000/FFFFFF?text=F',
      country: 'Italia',
      founded: 1947,
      description: 'La marca de superdeportivos más icónica del mundo',
      stories: [
        'https://placehold.co/300x200/FF0000/FFFFFF?text=Ferrari+Story+1',
        'https://placehold.co/300x200/FF0000/FFFFFF?text=Ferrari+Story+2',
        'https://placehold.co/300x200/FF0000/FFFFFF?text=Ferrari+Story+3'
      ]
    },
    {
      id: 2,
      name: 'Lamborghini',
      logo: 'https://placehold.co/120x120/FFD700/000000?text=L',
      country: 'Italia',
      founded: 1963,
      description: 'Superdeportivos con diseño agresivo y performance extrema',
      stories: [
        'https://placehold.co/300x200/FFD700/000000?text=Lamborghini+Story+1',
        'https://placehold.co/300x200/FFD700/000000?text=Lamborghini+Story+2',
        'https://placehold.co/300x200/FFD700/000000?text=Lamborghini+Story+3'
      ]
    },
    {
      id: 3,
      name: 'Porsche',
      logo: 'https://placehold.co/120x120/000000/FFFFFF?text=P',
      country: 'Alemania',
      founded: 1931,
      description: 'Precisión alemana en cada vehículo deportivo',
      stories: [
        'https://placehold.co/300x200/000000/FFFFFF?text=Porsche+Story+1',
        'https://placehold.co/300x200/000000/FFFFFF?text=Porsche+Story+2',
        'https://placehold.co/300x200/000000/FFFFFF?text=Porsche+Story+3'
      ]
    },
    {
      id: 4,
      name: 'Rolls-Royce',
      logo: 'https://placehold.co/120x120/000000/FFFFFF?text=RR',
      country: 'Reino Unido',
      founded: 1904,
      description: 'El lujo supremo en automoción',
      stories: [
        'https://placehold.co/300x200/000000/FFFFFF?text=Rolls+Story+1',
        'https://placehold.co/300x200/000000/FFFFFF?text=Rolls+Story+2',
        'https://placehold.co/300x200/000000/FFFFFF?text=Rolls+Story+3'
      ]
    }
  ];
  
  res.json({
    success: true,
    data: brands,
    count: brands.length
  });
});

// GET /api/brands/:id - Marca específica
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const brandId = parseInt(id);
  
  const brands = [
    {
      id: 1,
      name: 'Ferrari',
      logo: 'https://placehold.co/120x120/FF0000/FFFFFF?text=F',
      country: 'Italia',
      founded: 1947,
      description: 'La marca de superdeportivos más icónica del mundo',
      history: 'Ferrari fue fundada por Enzo Ferrari en 1947. La marca se ha convertido en sinónimo de superdeportivos de alta gama y éxito en la Fórmula 1.',
      models: ['SF90 Stradale', '488 GTB', 'F8 Tributo', 'Roma'],
      stories: [
        'https://placehold.co/300x200/FF0000/FFFFFF?text=Ferrari+Story+1',
        'https://placehold.co/300x200/FF0000/FFFFFF?text=Ferrari+Story+2',
        'https://placehold.co/300x200/FF0000/FFFFFF?text=Ferrari+Story+3'
      ]
    },
    {
      id: 2,
      name: 'Lamborghini',
      logo: 'https://placehold.co/120x120/FFD700/000000?text=L',
      country: 'Italia',
      founded: 1963,
      description: 'Superdeportivos con diseño agresivo y performance extrema',
      history: 'Fundada por Ferruccio Lamborghini en 1963, la marca se caracteriza por sus diseños agresivos y motores V12 de alta potencia.',
      models: ['Aventador', 'Huracán', 'Urus', 'Revuelto'],
      stories: [
        'https://placehold.co/300x200/FFD700/000000?text=Lamborghini+Story+1',
        'https://placehold.co/300x200/FFD700/000000?text=Lamborghini+Story+2',
        'https://placehold.co/300x200/FFD700/000000?text=Lamborghini+Story+3'
      ]
    }
  ];
  
  const brand = brands.find(b => b.id === brandId);
  
  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Marca no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: brand
  });
});

module.exports = router;
