const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());

// Configurar Express para servir la carpeta "imagenes"
app.use('/imagenes', express.static('imagenes'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '5563',
  database: 'litflix',
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos.');
});

// Endpoint para obtener todas las películas con calificación promedio
app.get('/api/peliculas', (req, res) => {
  const sql = `
    SELECT o.*, IFNULL(AVG(r.valoracion), 0) AS calificacion_promedio
    FROM obra o
    LEFT JOIN resenia r ON o.Id_obra = r.Id_obra
    WHERE o.tipo = 'pelicula'
    GROUP BY o.Id_obra;
  `;

  db.query(sql, (err, resultados) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(resultados); // Devolver las películas con la calificación promedio
  });
});

// Endpoint para obtener todas las series con calificación promedio
app.get('/api/series', (req, res) => {
  const sql = `
    SELECT o.*, IFNULL(AVG(r.valoracion), 0) AS calificacion_promedio
    FROM obra o
    LEFT JOIN resenia r ON o.Id_obra = r.Id_obra
    WHERE o.tipo = 'serie'
    GROUP BY o.Id_obra;
  `;

  db.query(sql, (err, resultados) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(resultados); // Devolver las series con la calificación promedio
  });
});

// Endpoint para obtener todos los libros con calificación promedio
app.get('/api/libros', (req, res) => {
  const sql = `
    SELECT o.*, IFNULL(AVG(r.valoracion), 0) AS calificacion_promedio
    FROM obra o
    LEFT JOIN resenia r ON o.Id_obra = r.Id_obra
    WHERE o.tipo = 'libro'
    GROUP BY o.Id_obra;
  `;

  db.query(sql, (err, resultados) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(resultados); // Devolver los libros con la calificación promedio
  });
});

// Iniciar el servidor
const PUERTO = 3001;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});
