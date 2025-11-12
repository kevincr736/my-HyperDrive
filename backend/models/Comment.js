const mongoose = require('mongoose');

// Esquema para el modelo Comment (Comentarios)
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'El texto del comentario es requerido'],
    trim: true,
    maxlength: [1000, 'El texto no puede exceder 1000 caracteres']
  },
  date: {
    type: Date,
    required: [true, 'La fecha del comentario es requerida'],
    default: Date.now
  },
  category: {
    type: String,
    required: [true, 'La categoría del comentario es requerida'],
    trim: true,
    maxlength: [100, 'La categoría no puede exceder 100 caracteres']
  },
  avatar: {
    type: String,
    required: [true, 'El avatar del comentario es requerido'],
    trim: true
  }, // Almacena base64 (data URI)
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

// Índices
commentSchema.index({ isActive: 1 });
commentSchema.index({ date: -1 }); // Para ordenar por fecha más reciente
commentSchema.index({ category: 1 }); // Para filtrar por categoría
commentSchema.index({ text: 'text' }); // Búsqueda de texto

// Método estático para obtener comentarios activos ordenados por fecha
commentSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ date: -1 });
};

// Método estático para obtener comentarios por categoría
commentSchema.statics.findByCategory = function(category) {
  return this.find({ isActive: true, category }).sort({ date: -1 });
};

module.exports = mongoose.model('Comment', commentSchema);

