const mongoose = require('mongoose');

// Esquema para el modelo State (Estados/Stories)
const stateSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: [true, 'La URL del video es requerida'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v) || v.startsWith('data:');
      },
      message: 'La URL del video debe ser una URL válida o base64'
    }
  },
  text: {
    type: String,
    required: [true, 'El texto del estado es requerido'],
    trim: true,
    maxlength: [200, 'El texto no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción del estado es requerida'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

// Índices
stateSchema.index({ isActive: 1 });
stateSchema.index({ createdAt: -1 }); // Para ordenar por fecha de creación más reciente
stateSchema.index({ text: 'text', description: 'text' }); // Búsqueda de texto

// Método estático para obtener estados activos ordenados por fecha
stateSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('State', stateSchema);

