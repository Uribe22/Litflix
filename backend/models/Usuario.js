const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
  correo: { type: String, required: true },
  contrasenia: { type: String, required: true },
  por_ver: [{
    fecha: { type: Date, required: true },
    espectativa: { type: Number, required: true },
  }],
  nombre: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', esquemaUsuario);