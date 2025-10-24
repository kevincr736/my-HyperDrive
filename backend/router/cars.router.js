const express = require('express');
const router = express.Router();

// Importar las rutas de cars
const carsRoutes = require('../services/cars');

// Usar las rutas de cars
router.use('/', carsRoutes);

module.exports = router;
