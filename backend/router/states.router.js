const express = require('express');
const router = express.Router();

// Importar las rutas de states
const statesRoutes = require('../services/states');

// Usar las rutas de states
router.use('/', statesRoutes);

module.exports = router;

