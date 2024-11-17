const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  correo: { type: String, required: true },
  contrasenia: { type: String, required: true },
  pendientes: [{
    fecha: { type: Date, required: true },
    espectativa: { type: Number, required: false },
  }],
  nombre: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', esquemaUsuario);