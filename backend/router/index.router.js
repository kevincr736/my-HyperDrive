const express = require('express');
const router = express.Router();

// Importar routers específicos
const carsRouter = require('./cars.router');
const loginRouter = require('./login.router');
const signupRouter = require('./signup.router');

// Rutas con prefijo /api
router.use('/api/cars', carsRouter);
router.use('/api', loginRouter);
router.use('/api', signupRouter);

module.exports = router;
