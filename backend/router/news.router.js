const express = require('express');
const router = express.Router();

// Importar las rutas de news
const newsRoutes = require('../services/news');

// Usar las rutas de news
router.use('/', newsRoutes);

module.exports = router;
