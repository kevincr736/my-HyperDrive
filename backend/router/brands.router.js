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
      description: 'La marca de superdeportivos más icónica del mundo'
    },
    {
      id: 2,
      name: 'Lamborghini',
      logo: 'https://placehold.co/120x120/FFD700/000000?text=L',
      country: 'Italia',
      founded: 1963,
      description: 'Superdeportivos con diseño agresivo y performance extrema'
    },
    {
      id: 3,
      name: 'Porsche',
      logo: 'https://placehold.co/120x120/000000/FFFFFF?text=P',
      country: 'Alemania',
      founded: 1931,
      description: 'Precisión alemana en cada vehículo deportivo'
    }
  ];
  
  res.json({
    success: true,
    data: brands,
    count: brands.length,
    message: 'Marcas obtenidas correctamente'
  });
});

// GET /api/brands/:id - Marca específica
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const brandId = parseInt(id);
  
  if (isNaN(brandId)) {
    return res.status(400).json({
      success: false,
      message: 'ID de marca inválido'
    });
  }
  
  res.json({
    success: true,
    data: {
      id: brandId,
      name: 'Marca de ejemplo',
      description: 'Esta es una marca de ejemplo'
    },
    message: 'Marca obtenida correctamente'
  });
});

module.exports = router;
