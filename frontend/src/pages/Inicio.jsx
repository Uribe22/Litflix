import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TarjetaObra from '../components/TarjetaObra';

export default function Inicio() {
  const [peliculas, setPeliculas] = useState([]);
  const [series, setSeries] = useState([]);
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuestaPeliculas = await axios.get('http://localhost:3001/api/peliculas');
        const respuestaSeries = await axios.get('http://localhost:3001/api/series');
        const respuestaLibros = await axios.get('http://localhost:3001/api/libros');

        setPeliculas(respuestaPeliculas.data);
        setSeries(respuestaSeries.data);
        setLibros(respuestaLibros.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <div className="contenedor">¿
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

      <h1 Series className="titulo-tipo">Series</h1>
      <div className="grid">
        {series.map((serie, index) => (
          <TarjetaObra
            key={index}
            titulo={serie.titulo}
            urlImagen={serie.imagen}
            calificacion={serie.rating}
          />
        ))}
      </div>

      <h1 Series className="titulo-tipo">Libros</h1>
      <div className="grid">
        {libros.map((libro, index) => (
          <TarjetaObra
            key={index}
            titulo={libro.titulo}
            urlImagen={libro.imagen}
            calificacion={libro.rating}
          />
        ))}
      </div>
    </div>
  );
}
