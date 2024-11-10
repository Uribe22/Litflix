import React, { useEffect, useState } from 'react';
import TarjetaObra from '../components/TarjetaObra';

export default function Inicio() {
  const [peliculas, setPeliculas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerPeliculas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/peliculas-mejor-valoradas');
        if (!response.ok) {
          throw new Error('Error en la carga de películas');
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
    <div className="contenedor-inicio">
      <h1 className="titulo-tipo">Películas Mejor Valoradas</h1>
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
