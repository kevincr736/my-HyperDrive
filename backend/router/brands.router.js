const express = require('express');
const router = express.Router();

// Importar las rutas de brands
const brandsRoutes = require('../services/brands');

// Usar las rutas de brands
router.use('/', brandsRoutes);

module.exports = router;
