const mongoose = require('mongoose');

const generarUrlImagen = (imagen) => {
    return `/imagenes/${imagen}`;
};

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
  imagenRuta: { type: String, default: function() { return generarUrlImagen(this.imagen); } }
});

module.exports = mongoose.model('Pelicula', esquemaPelicula);
