const mongoose = require('mongoose');

const esquemaResenia = new mongoose.Schema({
  obra: { type: String, required: true },
  autor: { type: String, required: true },
  comentario: { type: String, required: true },
  valoracion: { type: Number, required: true },
  fecha: { type: Date, required: true },
});

module.exports = mongoose.model('Resenia', esquemaResenia);