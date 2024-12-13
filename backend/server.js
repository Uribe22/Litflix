require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pelicula = require('./models/Pelicula');
const serie = require('./models/Serie');
const libro = require('./models/Libro');
const pendientes = require('./models/Pendientes');

const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET

app.use(cors());
app.use(express.json());
app.use('/imagenes', express.static('public/imagenes'));

const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No autorizado. Token requerido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuarioId = decoded.usuarioId;
        console.log('ID de usuario:', req.usuarioId);
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'El token ha expirado. Por favor, inicia sesión nuevamente.' });
        }

        return res.status(401).json({ message: 'Token inválido.' });
    }
};

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB', err));

const pool = mysql.createPool({
    host: process.env.MSQL_HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});

app.get('/api/peliculas', async (req, res) => {
    try {
        const peliculas = await pelicula.aggregate([
            {
                $sort: { titulo: 1 }
            }
        ]);

        res.json(peliculas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/series', async (req, res) => {
    try {
        const series = await serie.aggregate([
            {
                $sort: { titulo: 1 }
            }
        ]);
        res.json(series);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/libros', async (req, res) => {
    try {
        const libros = await libro.aggregate([
            {
                $sort: { titulo: 1 }
            }
        ]);
        res.json(libros);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/novedades-recientes', async (req, res) => {
    try {
      const obtenerDatos = async (tipo) => {
        const model = tipo === 'pelicula' ? pelicula : tipo === 'serie' ? serie : libro;
        return await model.aggregate([
          {
            $unwind: {
              path: '$resenias',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              _id: '$_id',
              tipo: { $first: tipo },
              titulo: { $first: '$titulo' },
              imagen: { $first: '$imagen' },
              fecha_lanzamiento: { $first: '$fecha_lanzamiento' },
              promedio_valoracion: { $avg: '$resenias.valoracion' }
            }
          },
          {
            $addFields: {
              promedio_valoracion: { $ifNull: ["$promedio_valoracion", 0] }
            }
          },
          {
            $sort: { fecha_lanzamiento: -1 }
          },
          {
            $limit: 5
          }
        ]);
      };
  
      const peliculas = await obtenerDatos('pelicula');
      const series = await obtenerDatos('serie');
      const libros = await obtenerDatos('libro');
  
      res.json({ peliculas, series, libros });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

app.post('/api/resenias', verificarToken, async (req, res) => {
    console.log('Datos recibidos en el backend:', req.body);

    const { tipo, idRelacionado, comentario, valoracion } = req.body;

    if (!tipo || !idRelacionado || !comentario || valoracion === undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const [usuario] = await pool.query('SELECT nombre FROM usuarios WHERE id = ?', [req.usuarioId]);

        if (!usuario || usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const model = tipo === 'pelicula' ? pelicula : tipo === 'serie' ? serie : libro;

        const itemRelacionado = await model.findById(idRelacionado).populate('resenias.autor');

        if (!itemRelacionado) {
            return res.status(404).json({ message: `No se encontró un ${tipo} con el ID proporcionado.` });
        }

        const nuevaResena = {
            autor: usuario[0].nombre,
            comentario,
            valoracion,
            fecha: new Date(),
        };

        itemRelacionado.resenias.push(nuevaResena);
        const resultado = await itemRelacionado.save();

        console.log('Reseña guardada correctamente en MongoDB:', nuevaResena);

        res.status(201).json({ message: 'Reseña agregada exitosamente.', reseña: nuevaResena });
    } catch (error) {
        console.error('Error al guardar la reseña en MongoDB:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


app.get('/api/buscar-peliculas', async (req, res) => {
    const termino = req.query.q;
    try {
        const peliculas = await pelicula.aggregate([
            { $match: { titulo: { $regex: termino, $options: 'i' } } },
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
            },
            {
                $addFields: {
                    promedio_valoracion: { $ifNull: ["$promedio_valoracion", 0] }
                }
            },
            { $sort: { titulo: 1 } }
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
            { $match: { titulo: { $regex: termino, $options: 'i' } } },
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
            },
            {
                $addFields: {
                    promedio_valoracion: { $ifNull: ["$promedio_valoracion", 0] }
                }
            },
            { $sort: { titulo: 1 } }
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
            { $match: { titulo: { $regex: termino, $options: 'i' } } },
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
            },
            {
                $addFields: {
                    promedio_valoracion: { $ifNull: ["$promedio_valoracion", 0] }
                }
            },
            { $sort: { titulo: 1 } }
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
        const createPipeline = (tipo) => [
            { $match: { titulo: { $regex: termino, $options: 'i' } } },
            { $unwind: { path: '$resenias', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$_id',
                    tipo: { $first: tipo },
                    titulo: { $first: '$titulo' },
                    imagen: { $first: '$imagen' },
                    fecha: { $first: '$fecha_lanzamiento' },
                    promedio_valoracion: { $avg: '$resenias.valoracion' }
                }
            },
            {
                $addFields: {
                    promedio_valoracion: { $ifNull: ['$promedio_valoracion', 0] }
                }
            }
        ];

        const [peliculas, series, libros] = await Promise.all([
            pelicula.aggregate(createPipeline('pelicula')),
            serie.aggregate(createPipeline('serie')),
            libro.aggregate(createPipeline('libro'))
        ]);

        const allResults = [...peliculas, ...series, ...libros];
        allResults.sort((a, b) => a.titulo.localeCompare(b.titulo));

        console.log("Todos los resultados ordenados:", allResults);

        res.json(allResults);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/verificar-usuario', async (req, res) => {
    const { nombre, correo } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT correo, nombre FROM usuarios WHERE correo = ? OR nombre = ?',
            [correo, nombre]
        );

        if (rows.length === 0) {
            return res.status(200).json({ message: 'Disponible' });
        }

        if (rows[0].correo === correo) {
            return res.status(400).json({ message: 'Correo no disponible' });
        }

        return res.status(400).json({ message: 'Nombre de usuario no disponible' });
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        res.status(500).json({ message: 'Error al verificar usuario', error });
    }
});

app.post('/api/registrar', async (req, res) => {
    const { nombre, correo, contrasenia } = req.body;

    try {
        const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10);

        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, correo, contrasenia) VALUES (?, ?, ?)',
            [nombre, correo, contraseniaEncriptada]
        );

        const id_usuario = result.insertId;

        const lista_pendientes = new pendientes({ id_usuario, lista: [] });
        await lista_pendientes.save();

        const token = jwt.sign(
            { usuarioId: id_usuario, correo },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'Usuario creado exitosamente', token, nombre });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(400).json({ message: 'Error al crear usuario', error });
    }
});

app.post("/api/iniciar-sesion", async (req, res) => {
    const { correo, contrasenia } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT id, nombre, contrasenia FROM usuarios WHERE correo = ?',
            [correo]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "El correo no existe." });
        }

        const esValida = await bcrypt.compare(contrasenia, rows[0].contrasenia);

        if (!esValida) {
            return res.status(400).json({ message: "Contraseña incorrecta." });
        }

        const nombre = rows[0].nombre;
        const token = jwt.sign(
            { usuarioId: rows[0].id, correo },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, nombre });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

app.get('/api/pendientes', verificarToken, async (req, res) => {
    try {
        const id_usuario = req.usuarioId;
        console.log(`Buscando pendientes para el usuario con ID: ${id_usuario}`);

        const lista_pendientes = await pendientes.findOne({ id_usuario });

        if (!lista_pendientes) {
            console.log('No se encontraron pendientes para este usuario.');
            return res.status(200).json([]);
        }

        console.log('Lista de pendientes:', lista_pendientes);
        res.status(200).json(lista_pendientes.lista);
    } catch (err) {
        console.error('Error en /api/pendientes:', err.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

app.post("/api/pendientes/agregar", verificarToken, async (req, res) => {
    try {
      const { id_usuario, obra } = req.body;
  
      let lista_pendientes = await pendientes.findOne({ id_usuario });
  
      if (!lista_pendientes) {
        lista_pendientes = new pendientes({
          id_usuario,
          lista: [
            {
              ...obra
            },
          ],
        });
        await lista_pendientes.save();
      } else {
        lista_pendientes.lista.push({
          ...obra
        });
        await lista_pendientes.save();
      }
  
      res.status(200).json({ message: "Obra agregada a la lista de pendientes" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Error al agregar obra a la lista de pendientes" });
    }
});

app.delete('/api/pendientes/:id', verificarToken, async (req, res) => {
    const usuarioId = req.usuarioId;
    const obraId = req.params.id;

    try {
        const pendiente = await pendientes.findOne({ id_usuario: usuarioId });
        console.log(pendiente);

        if (!pendiente) {
            return res.status(404).json({ message: 'No se encontró la lista de pendientes para este usuario.' });
        }

        const obraIndex = pendiente.lista.findIndex(obra => obra.id === obraId);

        if (obraIndex === -1) {
            return res.status(404).json({ message: 'La obra no se encuentra en la lista de pendientes.' });
        }

        pendiente.lista.splice(obraIndex, 1);

        await pendiente.save();

        console.log(`Obra eliminada con ID: ${obraId} para el usuario ${usuarioId}`);
        res.status(200).json({ message: 'Obra eliminada correctamente de la lista de pendientes.' });
    } catch (error) {
        console.error('Error al eliminar la obra:', error);
        res.status(500).json({ message: 'Error al eliminar la obra.' });
    }
});

app.post('/api/ajustes-cuenta/cambiar-nombre', verificarToken, async (req, res) => {
    const { nuevoNombre } = req.body;
    const usuarioId = req.usuarioId;

    if (!nuevoNombre) {
        return res.status(400).json({ message: 'El nuevo nombre es requerido.' });
    }

    try {
        const connection = await pool.getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT id FROM usuarios WHERE nombre = ?',
                [nuevoNombre]
            );

            if (rows.length > 0) {
                return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
            }

            const [currentUser] = await connection.execute(
                'SELECT nombre FROM usuarios WHERE id = ?',
                [usuarioId]
            );

            if (currentUser.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const nombreActual = currentUser[0].nombre;

            await connection.execute(
                'UPDATE usuarios SET nombre = ? WHERE id = ?',
                [nuevoNombre, usuarioId]
            );

            await Promise.all([
                libro.updateMany(
                    { 'resenias.autor': nombreActual },
                    { $set: { 'resenias.$[elem].autor': nuevoNombre } },
                    { arrayFilters: [{ 'elem.autor': nombreActual }] }
                ),
                pelicula.updateMany(
                    { 'resenias.autor': nombreActual },
                    { $set: { 'resenias.$[elem].autor': nuevoNombre } },
                    { arrayFilters: [{ 'elem.autor': nombreActual }] }
                ),
                serie.updateMany(
                    { 'resenias.autor': nombreActual },
                    { $set: { 'resenias.$[elem].autor': nuevoNombre } },
                    { arrayFilters: [{ 'elem.autor': nombreActual }] }
                )
            ]);

            return res.status(200).json({ message: 'Nombre de usuario actualizado correctamente.' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al cambiar el nombre de usuario:', error);
        return res.status(500).json({ message: 'Hubo un error al cambiar el nombre de usuario.' });
    }
});

app.post('/api/ajustes-cuenta/cambiar-correo', verificarToken, async (req, res) => {
    const { email } = req.body;
    const usuarioId = req.usuarioId;

    if (!email) {
        return res.status(400).json({ message: 'El correo es requerido.' });
    }

    try {
        const connection = await pool.getConnection();

        try {
            const [existingEmailRows] = await connection.execute(
                'SELECT id FROM usuarios WHERE correo = ?',
                [email]
            );

            if (existingEmailRows.length > 0) {
                return res.status(409).json({ message: 'El correo ya está en uso.' });
            }

            const [rows] = await connection.execute(
                'UPDATE usuarios SET correo = ? WHERE id = ?',
                [email, usuarioId]
            );

            if (rows.affectedRows === 1) {
                return res.status(200).json({ message: 'Correo actualizado correctamente.' });
            } else {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al cambiar el correo:', error);
        return res.status(500).json({ message: 'Hubo un error al cambiar el correo.' });
    }
});


app.post('/api/ajustes-cuenta/cambiar-contrasena', verificarToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const usuarioId = req.usuarioId;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'La contraseña actual y la nueva contraseña son requeridas.' });
    }

    try {
        const connection = await pool.getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT contrasenia FROM usuarios WHERE id = ?',
                [usuarioId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const storedPassword = rows[0].contrasenia;

            const passwordMatch = await bcrypt.compare(currentPassword, storedPassword);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            await connection.execute(
                'UPDATE usuarios SET contrasenia = ? WHERE id = ?',
                [hashedNewPassword, usuarioId]
            );

            return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ message: 'Hubo un error al cambiar la contraseña.' });
    }
});

app.post('/api/ajustes-cuenta/eliminar-cuenta', verificarToken, async (req, res) => {
    const { password } = req.body;
    const usuarioId = req.usuarioId;

    if (!password) {
        return res.status(400).json({ message: 'La contraseña es requerida para confirmar la eliminación.' });
    }

    try {
        const connection = await pool.getConnection();

        try {
            const [rows] = await connection.execute(
                'SELECT contrasenia, nombre FROM usuarios WHERE id = ?',
                [usuarioId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const storedPassword = rows[0].contrasenia;
            const nombreUsuario = rows[0].nombre;

            const passwordMatch = await bcrypt.compare(password, storedPassword);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'La contraseña es incorrecta.' });
            }

            await connection.execute(
                'DELETE FROM usuarios WHERE id = ?',
                [usuarioId]
            );

            await Promise.all([
                libro.updateMany(
                    { 'resenias.autor': nombreUsuario },
                    { $pull: { resenias: { autor: nombreUsuario } } }
                ),
                pelicula.updateMany(
                    { 'resenias.autor': nombreUsuario },
                    { $pull: { resenias: { autor: nombreUsuario } } }
                ),
                serie.updateMany(
                    { 'resenias.autor': nombreUsuario },
                    { $pull: { resenias: { autor: nombreUsuario } } }
                )
            ]);

            await pendientes.deleteOne({ id_usuario: usuarioId });

            return res.status(200).json({ message: 'Cuenta eliminada correctamente.' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la cuenta.' });
    }
});

app.get('/', (req, res) => {
    res.send('¡Bienvenido a Litflix!');
});

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});