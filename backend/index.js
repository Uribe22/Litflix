const express = require('express');
const sequelize = require('./config/database'); // Importamos la conexión a la base de datos

const app = express();
app.use(express.json()); // Para manejar JSON

// Verificar conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos MySQL exitosa'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

app.get('/', (req, res) => {
  res.send('Bienvenido a Litflix');
});

app.get('/generos', async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT * FROM genero');
    res.json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).send('Error al obtener datos');
  }
});

// Cambia el puerto del backend a 3000 para evitar conflictos con el frontend
const port = process.env.PORT || 3000; // Usa 3000 si PORT no está definido

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
