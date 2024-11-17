import React, { useEffect, useState } from 'react';
import TarjetaObra from '../components/TarjetaObra';

export default function Inicio() {
  const [novedades, setNovedades] = useState({ peliculas: [], series: [], libros: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerNovedades = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/novedades-recientes');
        if (!response.ok) {
          throw new Error('Error en la carga de novedades');
        }
        const data = await response.json();
        setNovedades(data);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerNovedades();
  }, []);

  return (
    <div className="contenedor-inicio">
      <h1 className="titulo-tipo">Novedades</h1>
      {error && <p>{error}</p>}
      
      {['peliculas', 'series', 'libros'].map((categoria) => (
        <>
          <h2 className="categoria">{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h2>
          <div className="grid">
            {novedades[categoria].map((obra) => (
              <TarjetaObra
                key={obra._id || obra.id}
                idObra={obra._id || obra.id}
                titulo={obra.titulo}
                tipo={obra.tipo}
                imagen={obra.imagen}
                fecha_lanzamiento={obra.fecha_lanzamiento}
                calificacion_promedio={obra.promedio_valoracion}
              />
            ))}
          </div>
        </>
      ))}
    </div>
  );
}
