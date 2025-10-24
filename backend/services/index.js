const express = require('express');
const router = express.Router();

// Importar todas las rutas
const carsRoutes = require('./cars');
const newsRoutes = require('./news');
const brandsRoutes = require('./brands');

// Configurar rutas
router.use('/cars', carsRoutes);
router.use('/news', newsRoutes);
router.use('/brands', brandsRoutes);

module.exports = router;
