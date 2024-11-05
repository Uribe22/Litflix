const mongoose = require('mongoose');

const esquemaPelicula = new mongoose.Schema({
  titulo: { type: String, required: true },
  director: { type: String, required: true },
  productora: { type: String, required: true },
  fecha_estreno: { type: Date, required: true },
  duracion: { type: Number, required: true },
  generos: [{ type: String }],
  elenco: [{
    nombre: { type: String, required: true },
    rol: { type: String, required: true }
  }],
  sinopsis: { type: String, required: true },
  imagen: { type: String, required: true },
  tipo: { type: String, required: true },
  resenia: [{
    autor: { type: String, required: true },
    comentario: { type: String, required: true },
    valoracion: { type: Number, required: true },
    fecha: { type: Date, required: true }
  }]
});

module.exports = mongoose.model('Pelicula', esquemaPelicula);
