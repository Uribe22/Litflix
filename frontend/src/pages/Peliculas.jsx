import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TarjetaObra from '../components/TarjetaObra'; // Asegúrate de que el componente TarjetaObra ya exista

export default function Peliculas() {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    const obtenerPeliculas = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3001/api/peliculas');
        setPeliculas(respuesta.data);
      } catch (error) {
        console.error('Error al obtener las películas:', error);
      }
    };

    obtenerPeliculas();
  }, []);

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Películas</h1>
      <div className="grid">
        {peliculas.map((pelicula, index) => (
          <TarjetaObra
            key={index}
            titulo={pelicula.titulo}
            urlImagen={pelicula.imagen}
            calificacion={pelicula.rating}
          />
        ))}
      </div>
    </div>
  );
}
