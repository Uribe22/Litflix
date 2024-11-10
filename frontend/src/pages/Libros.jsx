import React, { useEffect, useState } from 'react';
import TarjetaObra from '../components/TarjetaObra';

export default function Libros() {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerLibros = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/libros');
        if (!response.ok) {
          throw new Error('Error en la carga de libros');
        }
        const data = await response.json();

        const librosConValoracion = data.map(libro => {
          const valoraciones = libro.resenias.map(r => r.valoracion);
          const promedio = valoraciones.length > 0 
            ? (valoraciones.reduce((sum, val) => sum + val, 0) / valoraciones.length).toFixed(1) 
            : null;

          return { ...libro, promedio_valoracion: promedio };
        });

        setLibros(librosConValoracion);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerLibros();
  }, []);

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Libros</h1>
      {error && <p>{error}</p>}
      <div className="grid">
        {libros.map((libro) => (
          <TarjetaObra
            key={libro._id}
            idObra={libro._id}
            titulo={libro.titulo}
            imagen={libro.imagen}
            fecha_lanzamiento={libro.fecha_lanzamiento}
            calificacion_promedio={libro.promedio_valoracion}
          />
        ))}
      </div>
    </div>
  );
}

