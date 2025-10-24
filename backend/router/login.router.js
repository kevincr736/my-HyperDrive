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

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Todos los campos son obligatorios',
        data: null
      });
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Las contraseñas no coinciden',
        data: null
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Formato de email inválido',
        data: null
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'La contraseña debe tener al menos 6 caracteres',
        data: null
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: 'Ya existe un usuario con este email',
        data: null
      });
    }

    // Crear nuevo usuario
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'user',
      isActive: true
    });

    // Guardar usuario en la base de datos
    const savedUser = await newUser.save();

    // Respuesta exitosa (sin incluir la contraseña)
    res.status(201).json({
      success: true,
      status: 201,
      message: 'Usuario registrado exitosamente',
      data: {
        user: savedUser.toJSON() // Usa el método toJSON que excluye la contraseña
      }
    });

  } catch (error) {
    console.error('Error en signup:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Error de validación',
        data: {
          errors: errors
        }
      });
    }

    // Manejar error de duplicado de email
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: 'Ya existe un usuario con este email',
        data: null
      });
    }

    res.status(500).json({
      success: false,
      status: 500,
      message: 'Error interno del servidor',
      data: null
    });
  }
});

module.exports = router;