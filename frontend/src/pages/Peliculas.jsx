import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import TarjetaObra from '../components/TarjetaObra';

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
        {peliculas.map((pelicula) => (
          <TarjetaObra
            key={pelicula.Id_obra}
            idObra={pelicula.Id_obra}
            titulo={pelicula.titulo}
            urlImagen={pelicula.imagen}
            calificacion_promedio={pelicula.promedio_valoracion}
            fecha_lanzamiento={pelicula.fecha_lanzamiento}
          />
        ))}
      </div>
    </div>
  );
}
