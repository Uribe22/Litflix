require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const pelicula = require('./models/Pelicula');
const serie = require('./models/Serie');
const libro = require('./models/Libro');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/imagenes', express.static('public/imagenes'));

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB', err));

app.get('/api/peliculas', async (req, res) => {
    try {
        const peliculas = await pelicula.find();
        res.json(peliculas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/series', async (req, res) => {
    try {
        const series = await serie.find();
        res.json(series);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/libros', async (req, res) => {
    try {
        const libros = await libro.find();
        res.json(libros);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/api/buscar-peliculas', async (req, res) => { 
    const termino = req.query.q;
    try {
        const results = await pelicula.find({
            $or: [
                { titulo: { $regex: termino, $options: 'i' } },
                { autor: { $regex: termino, $options: 'i' } }
            ]
        });

        const formattedResults = results.map(item => ({
            Id_obra: item._id,
            titulo: item.titulo,
            imagen: item.imagen || 'default_image.jpg',
            fecha_publicacion: item.fecha_publicacion,
        }));

        res.json(formattedResults);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
  res.send('¡Bienvenido a Litflix!');
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

/*const serieSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    productora: { type: String, required: true },
    temporadas: { type: Number, required: true },
    fecha_estreno: { type: Date, required: true },
    fecha_finalizacion: { type: Date },
    generos: { type: [String], required: true },
    elenco: [{
        nombre: { type: String, required: true },
        rol: { type: String, required: true },
    }],
    sinopsis: { type: String, required: true },
    imagen: { type: String, default: function() { return generarUrlImagen(this.titulo); } },
});

const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    productora: { type: String, required: true },
    fecha_publicacion: { type: Date, required: true },
    generos: { type: [String], required: true },
    numero_paginas: { type: Number, required: true },
    sinopsis: { type: String, required: true },
    imagen: { type: String, default: function() { return generarUrlImagen(this.titulo); } },
});

const reseñaSchema = new mongoose.Schema({
    obra: { type: mongoose.Schema.Types.ObjectId, ref: 'Obra' },
    autor: { type: String, required: true },
    comentario: { type: String, required: true },
    valoracion: { type: Number, required: true, min: 1, max: 5, validate: {
        validator: Number.isFinite,
        message: 'La valoración debe ser un número.'
    }},
    fecha: { type: Date, default: Date.now },
});*/

//const Pelicula = mongoose.model('Pelicula', peliculaSchema);
/*const Serie = mongoose.model('Serie', serieSchema);
const Libro = mongoose.model('Libro', libroSchema);
const Resenia = mongoose.model('Resenia', reseñaSchema);*/

/*app.get('/api/mejor-valoradas', async (req, res) => {
    try {
        const peliculas = await Pelicula.aggregate([
            {
                $lookup: {
                    from: 'resenias',
                    localField: '_id',
                    foreignField: 'obra',
                    as: 'resenias',
                },
            },
            {
                $addFields: {
                    valoracion_promedio: { $avg: '$resenias.valoracion' },
                    total_resenias: { $size: '$resenias' },
                },
            },
            { $match: { total_resenias: { $gt: 0 } } },
            { $sort: { valoracion_promedio: -1 } },
            { $limit: 5 },
        ]);
        res.json(peliculas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});*/

