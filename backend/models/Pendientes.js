const mongoose = require('mongoose');

const esquemaPendientes = new mongoose.Schema({
  id_usuario: { type: Number, required: true },
  lista: [{
    id: { type: String, required: true },
    titulo: { type: String, required: true },
    tipo: { type: String, required: true },
    fecha: { type: Date, required: true },
    imagen: { type: String, required: true }
  }],
});

module.exports = mongoose.model('Pendientes', esquemaPendientes);