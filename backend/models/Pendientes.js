const mongoose = require('mongoose');

const esquemaPendientes = new mongoose.Schema({
  id_usuario: { type: Number, required: true },
  lista: [{
    titulo: { type: String, required: true },
    tipo: { type: String, required: true },
    fecha: { type: Date, required: true },
    espectativa: { type: Number, required: false },
  }],
});

module.exports = mongoose.model('Pendientes', esquemaPendientes);