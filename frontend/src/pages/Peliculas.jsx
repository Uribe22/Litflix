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
        {peliculas.map((pelicula) => (
          <TarjetaObra
            key={pelicula.Id_obra} // Usa el Id_obra como key
            idObra={pelicula.Id_obra} // Asegúrate de pasar el idObra al componente
            titulo={pelicula.titulo}
            urlImagen={pelicula.imagen}
            calificacion_promedio={pelicula.promedio_valoracion}  // Usa promedio_valoracion para la calificación
            fecha_lanzamiento={pelicula.fecha_lanzamiento}  // Pasar la fecha de lanzamiento
          />
        ))}
      </div>
    </div>
  );
}
