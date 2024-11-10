import React, { useEffect, useState } from 'react';
import TarjetaObra from '../components/TarjetaObra';

export default function Series() {
  const [series, setSeries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerSeries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/series');
        if (!response.ok) {
          throw new Error('Error en la carga de series');
        }
        const data = await response.json();

        const seriesConValoracion = data.map(serie => {
          const valoraciones = serie.resenias.map(r => r.valoracion);
          const promedio = valoraciones.length > 0 
            ? (valoraciones.reduce((sum, val) => sum + val, 0) / valoraciones.length).toFixed(1) 
            : null;

          return { ...serie, promedio_valoracion: promedio };
        });

        setSeries(seriesConValoracion);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerSeries();
  }, []);

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Series</h1>
      {error && <p>{error}</p>}
      <div className="grid">
        {series.map((serie) => (
          <TarjetaObra
            key={serie._id || serie.id}
            idObra={serie._id || serie.id} 
            titulo={serie.titulo}
            tipo={serie.tipo}
            imagen={serie.imagen}
            fecha_publicacion={serie.fecha_estreno}
            calificacion_promedio={serie.promedio_valoracion}
          />
        ))}
      </div>
    </div>
  );
}

