const express = require('express');
const router = express.Router();

// Importar las rutas de comments
const commentsRoutes = require('../services/comments');

// Usar las rutas de comments
router.use('/', commentsRoutes);

module.exports = router;

