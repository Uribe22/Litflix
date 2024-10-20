const mongoose = require('mongoose');

const generarUrlImagen = (imagen) => {
    return `/imagenes/${imagen}`;
};

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
  imagenRuta: { type: String, default: function() { return generarUrlImagen(this.imagen); } }
});

module.exports = mongoose.model('Libro', esquemaLibro);
