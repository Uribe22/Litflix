import React, { useEffect, useState } from 'react';
import TarjetaObra from '../components/TarjetaObra';

export default function Inicio() {
  const [peliculas, setPeliculas] = useState([]);
  const [errorPeliculas, setErrorPeliculas] = useState('');

  useEffect(() => {
    const obtenerPeliculas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/peliculas-mejor-valoradas');
        if (!response.ok) {
          throw new Error('Error en la carga de las películas');
        }
        const data = await response.json();
        setPeliculas(data);
      } catch (err) {
        setErrorPeliculas(err.message);
      }
    };

    obtenerPeliculas();
  }, []);

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Mejor Valoradas</h1>
      <h1 className="titulo-tipo">Películas</h1>
      {errorPeliculas && <p>{errorPeliculas}</p>}
      <div className="grid">
        {peliculas.map((pelicula) => (
          <TarjetaObra
            key={pelicula._id}
            titulo={pelicula.titulo}
            imagen={pelicula.imagen}
            fecha_publicacion={pelicula.fecha_publicacion}
          />
        ))}
      </div>
    </div>
  );
}
