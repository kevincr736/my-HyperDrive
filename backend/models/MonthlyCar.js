const mongoose = require('mongoose');

// Esquema para el vehículo mensual (solo un registro que se actualiza)
const monthlyCarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del vehículo es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  imageBase64: {
    type: String,
    required: [true, 'La imagen en base64 es requerida']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['deportivos', 'lujosos', 'clasicos', 'todo-terreno'],
    lowercase: true
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índice único para asegurar que solo haya un registro
monthlyCarSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

// Middleware pre-save
monthlyCarSchema.pre('save', function(next) {
  // Convertir el nombre a title case
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  next();
});

// Método estático para obtener o crear el vehículo mensual
monthlyCarSchema.statics.getOrCreateMonthlyCar = async function() {
  let monthlyCar = await this.findOne({ isActive: true });
  
  if (!monthlyCar) {
    // Si no existe, crear uno por defecto
    monthlyCar = new this({
      name: 'Vehículo Mensual',
      description: 'Descripción del vehículo mensual',
      imageBase64: '',
      category: 'deportivos',
      price: '$0',
      maxSpeed: '0 km/h',
      specifications: []
    });
    await monthlyCar.save();
  }
  
  return monthlyCar;
};

// Método para actualizar el vehículo mensual
monthlyCarSchema.statics.updateMonthlyCar = async function(updateData) {
  // Buscar el registro activo
  let monthlyCar = await this.findOne({ isActive: true });
  
  if (monthlyCar) {
    // Actualizar el registro existente
    Object.assign(monthlyCar, updateData);
    await monthlyCar.save();
  } else {
    // Crear nuevo registro si no existe
    monthlyCar = new this(updateData);
    await monthlyCar.save();
  }
  
  return monthlyCar;
};

module.exports = mongoose.model('MonthlyCar', monthlyCarSchema);
