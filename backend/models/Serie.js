const mongoose = require('mongoose');

const esquemaSerie = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  productora: { type: String, required: true },
  temporadas: { type: Number, required: true },
  fecha_estreno: { type: Date, required: true },
  fecha_finalizacion: { type: Date, required: false },
  generos: [{ type: String }],
  elenco: [{
    nombre: { type: String, required: true },
    rol: { type: String, required: true }
  }],
  sinopsis: { type: String, required: true },
  imagen: { type: String, required: true },
  tipo: { type: String, required: true },
  resenias: [{
    autor: { type: String, required: true },
    comentario: { type: String, required: true },
    valoracion: { type: Number, required: true },
    fecha: { type: Date, required: true }
  }]
});

module.exports = mongoose.model('Serie', esquemaSerie, 'series');
