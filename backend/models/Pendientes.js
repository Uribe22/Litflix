const mongoose = require('mongoose');

const esquemaPendientes = new mongoose.Schema({
  id_usuario: { type: Number, required: true },
  lista: [{
    fecha: { type: Date, required: true },
    espectativa: { type: Number, required: false },
  }],
});

module.exports = mongoose.model('Pendientes', esquemaPendientes);