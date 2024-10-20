import React, { useEffect, useState } from 'react';
import TarjetaObra from '../components/TarjetaObra';

export default function Peliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerPeliculas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/peliculas');
        if (!response.ok) {
            throw new Error('Error en la carga de las películas');
        }
        const data = await response.json();
        setPeliculas(data);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerPeliculas();
  }, []);

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Películas</h1>
      {error && <p>{error}</p>}
      <div className="grid">
        {peliculas.map((pelicula) => (
          <TarjetaObra
            key={pelicula.id}
            titulo={pelicula.titulo}
            imagen={pelicula.imagen}
            //calificacion_promedio={pelicula.promedio_valoracion}
            fecha_publicacion={pelicula.fecha_estreno}
          />
        ))}
      </div>
    </div>
  );
}
