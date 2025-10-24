const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validaciones básicas
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Todos los campos son obligatorios',
        data: {}
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Las contraseñas no coinciden',
        data: {}
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'La contraseña debe tener al menos 6 caracteres',
        data: {}
      });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: 'Este email ya está registrado',
        data: {}
      });
    }

    // Crear nuevo usuario
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: password // Se encriptará automáticamente con el middleware pre('save')
    });

    // Guardar usuario en MongoDB
    const savedUser = await newUser.save();

    console.log('👤 Nuevo usuario registrado en MongoDB:', {
      id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      createdAt: savedUser.createdAt
    });

    res.status(201).json({
      success: true,
      status: 201,
      message: 'Usuario creado exitosamente',
      data: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error en signup:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Datos inválidos',
        data: { errors }
      });
    }

    // Manejar errores de duplicado (email único)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: 'Este email ya está registrado',
        data: {}
      });
    }

    // Error interno del servidor
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Error interno del servidor',
      data: {}
    });
  }
});

module.exports = router;
