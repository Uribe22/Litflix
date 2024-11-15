require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pelicula = require('./models/Pelicula');
const serie = require('./models/Serie');
const libro = require('./models/Libro');
const usuario = require('./models/Usuario')
const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET

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
                    tipo: { $first: 'pelicula' },
                    titulo: { $first: '$titulo' },
                    imagen: { $first: '$imagen' },
                    fecha_lanzamiento: { $first: '$fecha_lanzamiento' },
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

app.get('/api/buscar-peliculas', async (req, res) => {
    const termino = req.query.q;
    try {
        const peliculas = await pelicula.aggregate([
            { $match: { $or: [ { titulo: { $regex: termino, $options: 'i' } }, { autor: { $regex: termino, $options: 'i' } } ] } },
            { $unwind: { path: '$resenias', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    tipo: { $first: 'pelicula' },
                    titulo: { $first: '$titulo' },
                    imagen: { $first: '$imagen' },
                    fecha: { $first: '$fecha_lanzamiento' },
                    promedio_valoracion: { $avg: '$resenias.valoracion' }
                }
            }
        ]);

        res.json(peliculas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta de búsqueda específica para series
app.get('/api/buscar-series', async (req, res) => {
    const termino = req.query.q;
    try {
        const series = await serie.aggregate([
            { $match: { $or: [ { titulo: { $regex: termino, $options: 'i' } }, { autor: { $regex: termino, $options: 'i' } } ] } },
            { $unwind: { path: '$resenias', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    tipo: { $first: 'serie' },
                    titulo: { $first: '$titulo' },
                    imagen: { $first: '$imagen' },
                    fecha: { $first: '$fecha_lanzamiento' },
                    promedio_valoracion: { $avg: '$resenias.valoracion' }
                }
            }
        ]);

        res.json(series);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Ruta de búsqueda específica para libros
app.get('/api/buscar-libros', async (req, res) => {
    const termino = req.query.q;
    try {
        const libros = await libro.aggregate([
            { $match: { $or: [ { titulo: { $regex: termino, $options: 'i' } }, { autor: { $regex: termino, $options: 'i' } } ] } },
            { $unwind: { path: '$resenias', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    tipo: { $first: 'libro' },
                    titulo: { $first: '$titulo' },
                    imagen: { $first: '$imagen' },
                    fecha: { $first: '$fecha_lanzamiento' },
                    promedio_valoracion: { $avg: '$resenias.valoracion' }
                }
            }
        ]);

        res.json(libros);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/buscar', async (req, res) => {
    const termino = req.query.q;
    console.log(`Término de búsqueda recibido: ${termino}`);

    try {
        const filtro = {
            $or: [
                { titulo: { $regex: termino, $options: 'i' } },
                { autor: { $regex: termino, $options: 'i' } }
            ]
        };
        const peliculas = await pelicula.aggregate([
            { $match: filtro },
            { $unwind: { path: '$resenias', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    tipo: { $first: 'pelicula' },
                    titulo: { $first: '$titulo' },
                    imagen: { $first: '$imagen' },
                    fecha: { $first: '$fecha_lanzamiento' },
                    promedio_valoracion: { $avg: '$resenias.valoracion' }
                }
            }
        ]);
        console.log("Peliculas encontradas:", peliculas);

        const series = await serie.aggregate([
            { $match: filtro },
            { $unwind: { path: '$resenias', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    tipo: { $first: 'serie' },
                    titulo: { $first: '$titulo' },
                    imagen: { $first: '$imagen' },
                    fecha: { $first: '$fecha_lanzamiento' },
                    promedio_valoracion: { $avg: '$resenias.valoracion' }
                }
            }
        ]);
        console.log("Series encontradas:", series);

        const libros = await libro.aggregate([
            { $match: filtro },
            { $unwind: { path: '$resenias', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    tipo: { $first: 'libro' },
                    titulo: { $first: '$titulo' },
                    imagen: { $first: '$imagen' },
                    fecha: { $first: '$fecha_lanzamiento' },
                    promedio_valoracion: { $avg: '$resenias.valoracion' }
                }
            }
        ]);
        console.log("Libros encontrados:", libros);

        const allResults = [...peliculas, ...series, ...libros];
        console.log("Todos los resultados:", allResults);

        res.json(allResults);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/verificar-usuario', async (req, res) => {
    const { nombre, correo } = req.body;
  
    try {
      const usuarioExistente = await usuario.findOne({ $or: [{ correo }, { nombre }] });

      if (!usuarioExistente) {
        return res.status(200).json({ message: 'Disponible' });
      }

      if (usuarioExistente.correo === correo) {
        return res.status(400).json({ message: 'Correo no disponible' });
      }

      return res.status(400).json({ message: 'Nombre de usuario no disponible' });

    } catch (error) {
      res.status(500).json({ message: 'Error al verificar usuario', error });
    }
});

app.post('/api/usuarios', async (req, res) => {
    const { nombre, correo, contrasenia } = req.body;

    try {
        const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10);

        const nuevoUsuario = new usuario( {nombre, correo, contrasenia:contraseniaEncriptada, pendientes: []} );
        await nuevoUsuario.save();

        const token = jwt.sign(
            { usuarioId: nuevoUsuario._id, correo: nuevoUsuario.correo },
            JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.status(201).json({ message: 'Usuario creado exitósamente', token })
    } catch (error) {
        res.status(400).json({ message: 'Error al crear usuario', error });
    }
});

app.post("/api/iniciar-sesion", async (req, res) => {
    const { correo, contrasenia } = req.body;
  
    try {
      const inicio = await usuario.findOne({ correo });
  
      if (!inicio) {
        return res.status(400).json({ message: "El correo no existe." });
      }
  
      const esValida = await bcrypt.compare(contrasenia, inicio.contrasenia);
  
      if (!esValida) {
        return res.status(400).json({ message: "Contraseña incorrecta." });
      }
  
      const token = jwt.sign(
        { userId: usuario._id },
        JWT_SECRET,
        { expiresIn: '1h' });
      res.json({ token });
  
    } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).json({ message: "Error en el servidor." });
    }
});

app.get('/', (req, res) => {
    res.send('¡Bienvenido a Litflix!');
});

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
