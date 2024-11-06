const mongoose = require('mongoose');

const esquemaLibro = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  productora: { type: String, required: true },
  fecha_publicacion: { type: Date, required: true },
  generos: [{ type: String }],
  num_paginas: { type: Number, required: true},
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

module.exports = mongoose.model('Libro', esquemaLibro);
