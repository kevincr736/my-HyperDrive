const mongoose = require('mongoose');

// Esquema para el modelo News (Noticias)
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la noticia es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  publicationDate: {
    type: Date,
    required: [true, 'La fecha de publicación es requerida'],
    default: Date.now
  },
  text: {
    type: String,
    required: [true, 'El texto de la noticia es requerido'],
    trim: true,
    maxlength: [10000, 'El texto no puede exceder 10000 caracteres']
  },
  image: {
    type: String,
    required: [true, 'La imagen de la noticia es requerida'],
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
newsSchema.index({ isActive: 1 });
newsSchema.index({ publicationDate: -1 }); // Para ordenar por fecha más reciente
newsSchema.index({ title: 'text', text: 'text' }); // Búsqueda de texto

// Middleware pre-save para convertir el título a title case
newsSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1).toLowerCase();
  }
  next();
});

// Método estático para obtener noticias activas ordenadas por fecha
newsSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ publicationDate: -1 });
};

// Método estático para buscar noticias por texto
newsSchema.statics.search = function(query) {
  return this.find({
    isActive: true,
    $text: { $search: query }
  }).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('News', newsSchema);

