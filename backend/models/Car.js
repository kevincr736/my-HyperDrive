const mongoose = require('mongoose');

// Esquema para el modelo Car
const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del vehículo es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  price: {
    type: String,
    required: [true, 'El precio es requerido'],
    trim: true
  },
  maxSpeed: {
    type: String,
    required: [true, 'La velocidad máxima es requerida'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['deportivos', 'lujosos', 'clasicos', 'todo-terreno'],
    lowercase: true
  },
  image: {
    type: String,
    required: [true, 'La imagen es requerida'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  specifications: [{
    icon: String,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
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
  carouselImages: [String],
  textos: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
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
carSchema.index({ category: 1 });
carSchema.index({ isFeatured: 1 });
carSchema.index({ isActive: 1 });
carSchema.index({ name: 'text', description: 'text' }); // Búsqueda de texto

// Middleware pre-save
carSchema.pre('save', function(next) {
  // Convertir el nombre a title case
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  next();
});

// Método para obtener vehículos por categoría
carSchema.statics.findByCategory = function(category) {
  return this.find({ category: category, isActive: true });
};

// Método para obtener vehículos destacados
carSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true });
};

// Método para búsqueda de texto
carSchema.statics.search = function(query) {
  return this.find({ 
    $text: { $search: query },
    isActive: true 
  });
};

// Exportar el modelo
module.exports = mongoose.model('Car', carSchema);
