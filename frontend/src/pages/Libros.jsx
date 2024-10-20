import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TarjetaObra from '../components/TarjetaObra';

export default function Libros() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const obtenerLibros = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/libros');
        setLibros(respuesta.data);
      } catch (error) {
        console.error('Error al obtener los libros:', error);
      }
    };

    obtenerLibros();
  }, []);

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Libros</h1>
      <div className="grid">
        {libros.map((libro) => (
          <TarjetaObra
            key={libro.id}
            titulo={libro.titulo}
            imagen={libro.imagenRuta}
            //calificacion_promedio={libro.promedio_valoracion}
            fecha_publicacion={libro.fecha_publicacion}
          />
        ))}
      </div>
    </div>
  );
}
