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

// Rutas para obtener películas
app.get('/api/peliculas', (req, res) => {
    db.query("SELECT * FROM obra WHERE tipo = 'pelicula'", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Rutas para obtener series
app.get('/api/series', (req, res) => {
    db.query("SELECT * FROM obra WHERE tipo = 'serie'", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Rutas para obtener libros
app.get('/api/libros', (req, res) => {
    db.query("SELECT * FROM obra WHERE tipo = 'libro'", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Rutas para obtener las mejores valoradas
app.get('/api/mejor-valoradas', (req, res) => {
    const query = `
        SELECT obra.*, AVG(resenia.valoracion) as valoracion_promedio
        FROM obra
        JOIN resenia ON obra.Id_obra = resenia.Id_obra
        GROUP BY obra.Id_obra
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
        SELECT *
        FROM obra
        ORDER BY fecha_lanzamiento DESC
        LIMIT 5`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Rutas para obtener las más reseñadas
app.get('/api/mas-reseñadas', (req, res) => {
    const query = `
        SELECT obra.*, COUNT(resenia.Id_resenia) as total_resenias
        FROM obra
        JOIN resenia ON obra.Id_obra = resenia.Id_obra
        GROUP BY obra.Id_obra
        ORDER BY total_resenias DESC
        LIMIT 5`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
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
