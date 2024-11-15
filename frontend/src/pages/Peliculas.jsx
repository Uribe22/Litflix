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
          throw new Error('Error en la carga de Peliculas');
        }
        const data = await response.json();

        const peliculasConValoracion = data.map(pelicula => {
          const valoraciones = pelicula.resenias.map(r => r.valoracion);
          const promedio = valoraciones.length > 0 
            ? (valoraciones.reduce((sum, val) => sum + val, 0) / valoraciones.length).toFixed(1) 
            : null;

          return { ...pelicula, promedio_valoracion: promedio };
        });

        setPeliculas(peliculasConValoracion);
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
            key={pelicula._id || pelicula.id}
            idObra={pelicula._id || pelicula.id} 
            titulo={pelicula.titulo}
            tipo={pelicula.tipo}
            imagen={pelicula.imagen}
            fecha_lanzamiento={pelicula.fecha_lanzamiento}
            calificacion_promedio={pelicula.promedio_valoracion}
          />
        ))}
      </div>
    </div>
  );
}
