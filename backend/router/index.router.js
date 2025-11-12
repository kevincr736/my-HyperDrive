const express = require('express');
const router = express.Router();

// Importar routers específicos
const carsRouter = require('./cars.router');
const brandsRouter = require('./brands.router');
const newsRouter = require('./news.router');
const commentsRouter = require('./comments.router');
const statesRouter = require('./states.router');
const loginRouter = require('./login.router');
const signupRouter = require('./signup.router');

// Rutas con prefijo /api
router.use('/api/cars', carsRouter);
router.use('/api/brands', brandsRouter);
router.use('/api/news', newsRouter);
router.use('/api/comments', commentsRouter);
router.use('/api/states', statesRouter);
router.use('/api', loginRouter);
router.use('/api', signupRouter);

module.exports = router;
