import React, { useEffect, useState } from 'react';
import Tarjeta from '../components/Tarjeta';


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

  const renderCategoria = (categoria) => (
    <div key={categoria} className={`categoria-contenedor categoria-${categoria}`}>
      <h2 className="categoria-titulo">{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h2>
      {novedades[categoria].length > 0 ? (
        <div className="grid">
          {novedades[categoria].map((obra) => (
            <Tarjeta
              key={obra._id || obra.id}
              id={obra._id || obra.id}
              titulo={obra.titulo}
              tipo={obra.tipo}
              imagen={obra.imagen}
              fecha={obra.fecha_lanzamiento}
              calificacion={obra.promedio_valoracion}
              contexto="obra"
            />
          ))}
        </div>
      ) : (
        <p className="categoria-empty">No hay novedades en esta categoría.</p>
      )}
    </div>
  );

  return (
    <div className="contenedor-inicio">
      <h1 className="titulo-inicio">Novedades</h1>
      {error && <div className="error-mensaje">{error}</div>}
     
      {['peliculas', 'series', 'libros'].map((categoria) => renderCategoria(categoria))}
    </div>
  );
}
