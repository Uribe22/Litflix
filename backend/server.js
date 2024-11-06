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

app.get('/api/peliculas-mejor-valoradas', async (req, res) => {
    try {
        const peliculas = await pelicula.aggregate([
            {
                $unwind: {
                    path: '$resenias', 
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    titulo: { $first: '$titulo' },
                    imagen: { $first: '$imagen' },
                    fecha_publicacion: { $first: '$fecha_estreno' },
                    promedio_valoracion: { $avg: '$resenias.valoracion' }
                }
            },
            {
                $match: { promedio_valoracion: { $ne: null } }
            },
            {
                $sort: { promedio_valoracion: -1 }
            },
            {
                $limit: 5
            }
        ]);

        res.json(peliculas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/', (req, res) => {
  res.send('¡Bienvenido a Litflix!');
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});



