require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

process.on('SIGINT', () => {
    db.end(err => {
        if (err) {
            console.error('Error closing the database connection:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit();
    });
});

// Asegúrate de crear una carpeta '/images' donde estarán tus imágenes
app.use('/imagenes', express.static('public/imagenes'));

// Rutas para obtener las mejores valoradas
app.get('/api/mejor-valoradas', (req, res) => {
    const query = `
        SELECT obra.*, 
            IFNULL(AVG(resenia.valoracion), 0) as valoracion_promedio, 
            COUNT(resenia.Id_resenia) as total_resenias
        FROM obra
        LEFT JOIN resenia ON obra.Id_obra = resenia.Id_obra
        GROUP BY obra.Id_obra
        HAVING total_resenias > 0
        ORDER BY valoracion_promedio DESC
        LIMIT 5`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Rutas para obtener los últimos estrenos
app.get('/api/ultimos-estrenos', (req, res) => {
    const query = `
        SELECT obra.*, 
            IFNULL(AVG(resenia.valoracion), 0) as valoracion_promedio, 
            COUNT(resenia.Id_resenia) as total_resenias
        FROM obra
        LEFT JOIN resenia ON obra.Id_obra = resenia.Id_obra
        GROUP BY obra.Id_obra
        ORDER BY fecha_lanzamiento DESC
        LIMIT 5`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Rutas para obtener las más reseñadas
app.get('/api/mas-resenadas', (req, res) => {
    const query = `
        SELECT obra.*, 
            IFNULL(AVG(resenia.valoracion), 0) as valoracion_promedio, 
            COUNT(resenia.Id_resenia) as total_resenias
        FROM obra
        LEFT JOIN resenia ON obra.Id_obra = resenia.Id_obra
        GROUP BY obra.Id_obra
        HAVING total_resenias > 0
        ORDER BY total_resenias DESC
        LIMIT 5`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Ruta genérica para buscar en todas las categorías (libros, series, películas)
app.get('/api/buscar', (req, res) => {
    const termino = req.query.q;
    const query = `
      SELECT * FROM obra 
      WHERE titulo LIKE ? 
      OR autor LIKE ? 
      OR sinopsis LIKE ?`;

    db.query(query, [`%${termino}%`, `%${termino}%`, `%${termino}%`], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
});
app.get('/api/peliculas', (req, res) => {
    const query = `
      SELECT obra.Id_obra, obra.titulo, obra.imagen, obra.fecha_lanzamiento, 
             IFNULL(AVG(resenia.valoracion), 0) as promedio_valoracion, 
             COUNT(resenia.Id_resenia) as total_resenias
      FROM obra
      LEFT JOIN resenia ON obra.Id_obra = resenia.Id_obra
      WHERE obra.tipo = 'pelicula'
      GROUP BY obra.Id_obra
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.get('/api/series', (req, res) => {
    const query = `
      SELECT obra.Id_obra, obra.titulo, obra.imagen, obra.fecha_lanzamiento, 
             IFNULL(AVG(resenia.valoracion), 0) as promedio_valoracion, 
             COUNT(resenia.Id_resenia) as total_resenias
      FROM obra
      LEFT JOIN resenia ON obra.Id_obra = resenia.Id_obra
      WHERE obra.tipo = 'serie'
      GROUP BY obra.Id_obra
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.get('/api/libros', (req, res) => {
    const query = `
      SELECT obra.Id_obra, obra.titulo, obra.imagen, obra.fecha_lanzamiento, 
             IFNULL(AVG(resenia.valoracion), 0) as promedio_valoracion, 
             COUNT(resenia.Id_resenia) as total_resenias
      FROM obra
      LEFT JOIN resenia ON obra.Id_obra = resenia.Id_obra
      WHERE obra.tipo = 'libro'
      GROUP BY obra.Id_obra
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// Ruta para buscar series
app.get('/api/buscar-series', (req, res) => {
    const termino = req.query.q;
    const query = `
      SELECT * FROM obra 
      WHERE tipo = 'serie' 
      AND (titulo LIKE ? OR autor LIKE ? OR sinopsis LIKE ?)`;

    db.query(query, [`%${termino}%`, `%${termino}%`, `%${termino}%`], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
});
app.get('/api/buscar-libros', (req, res) => {
    const termino = req.query.q;
    const query = `
      SELECT * FROM obra 
      WHERE tipo = 'libro' 
      AND (titulo LIKE ? OR autor LIKE ? OR sinopsis LIKE ?)`;
  
    db.query(query, [`%${termino}%`, `%${termino}%`, `%${termino}%`], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });
  
// Ruta para buscar películas
app.get('/api/buscar-peliculas', (req, res) => {
    const termino = req.query.q;
    const query = `
      SELECT * FROM obra 
      WHERE tipo = 'pelicula' 
      AND (titulo LIKE ? OR autor LIKE ? OR sinopsis LIKE ?)`;

    db.query(query, [`%${termino}%`, `%${termino}%`, `%${termino}%`], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
});

// Ruta para obtener el promedio de calificación de una obra
app.get('/api/calificacion/:idObra', (req, res) => {
    const idObra = req.params.idObra;  // Extrae el ID de la obra de los parámetros
    const query = `
        SELECT IFNULL(AVG(valoracion), 0) as valoracion_promedio
        FROM resenia
        WHERE Id_obra = ?
    `;

    db.query(query, [idObra], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No se encontraron reseñas para esta obra' });
        }
        res.json(results[0]);
    });
});


// Ruta raíz para mostrar un mensaje de bienvenida
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de la página de reseñas de series, películas y libros');
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
