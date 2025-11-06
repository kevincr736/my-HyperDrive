const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionen email y contraseña
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Email y contraseña son obligatorios',
        data: null
      });
    }

    // Buscar usuario por email (incluyendo la contraseña para comparar)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Credenciales inválidas',
        data: null
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Cuenta desactivada',
        data: null
      });
    }

    // Comparar contraseña
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Credenciales inválidas',
        data: null
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Respuesta exitosa (sin incluir la contraseña)
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Login exitoso',
      data: {
        user: user.toJSON(), // Usa el método toJSON que excluye la contraseña
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Error interno del servidor',
      data: null
    });
  }
});

module.exports = router;