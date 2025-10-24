const express = require('express');
const router = express.Router();

// Importar routers específicos
const carsRouter = require('./cars.router');
const loginRouter = require('./login.router');
const signupRouter = require('./signup.router');

router.use('/cars', carsRouter);
router.use(loginRouter);
router.use(signupRouter);

module.exports = router;
