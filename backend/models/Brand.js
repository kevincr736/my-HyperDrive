const mongoose = require('mongoose');

// Esquema para el modelo Brand (Marcas de carros)
const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la marca es requerido'],
    trim: true,
    unique: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  timeline: [{
    year: {
      type: Number,
      required: true,
      min: [1800, 'El año debe ser válido'],
      max: [new Date().getFullYear() + 10, 'El año no puede ser muy futuro']
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'La descripción del evento no puede exceder 500 caracteres']
    }
  }],
  logo: {
    type: String,
    required: [true, 'El logo de la marca es requerido'],
    trim: true
    // Almacena base64 (data URI)
  },
  carImage: {
    type: String,
    required: [true, 'La imagen del carro es requerida'],
    trim: true
    // Almacena base64 (data URI)
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  versionKey: false // Remueve el campo __v
});

// Índices para mejorar el rendimiento
// name ya tiene índice único por el campo unique: true
brandSchema.index({ isActive: 1 });
brandSchema.index({ name: 'text', description: 'text' }); // Búsqueda de texto

// Middleware pre-save
brandSchema.pre('save', function(next) {
  // Convertir el nombre a title case
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  next();
});

// Método para obtener marcas activas
brandSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Método para búsqueda de texto
brandSchema.statics.search = function(query) {
  return this.find({ 
    $text: { $search: query },
    isActive: true 
  });
};

// Método para obtener marcas con timeline ordenado
brandSchema.methods.getOrderedTimeline = function() {
  return this.timeline.sort((a, b) => a.year - b.year);
};

// Exportar el modelo
module.exports = mongoose.model('Brand', brandSchema);

