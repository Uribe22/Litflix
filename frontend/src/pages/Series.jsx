import React, { useEffect, useState } from 'react';
import Tarjeta from '../components/Tarjeta';
import Filtro from '../components/Filtro';

export default function Series() {
  const [series, setSeries] = useState([]);
  const [seriesFiltradas, setSeriesFiltradas] = useState([]); // Estado para las series filtradas
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    genero: '',
    anio: '',
    calificacion: 0,
  });

  useEffect(() => {
    const obtenerSeries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/series');
        if (!response.ok) {
          throw new Error('Error en la carga de series');
        }
        const data = await response.json();

        const seriesConValoracion = data.map((serie) => {
          const valoraciones = serie.resenias.map((r) => r.valoracion);
          const promedio =
            valoraciones.length > 0
              ? (valoraciones.reduce((sum, val) => sum + val, 0) / valoraciones.length).toFixed(1)
              : 0;

          return { ...serie, promedio_valoracion: promedio };
        });

        setSeries(seriesConValoracion);
        setSeriesFiltradas(seriesConValoracion); // Inicializar con todas las series
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerSeries();
  }, []);

  // Filtrar series cuando cambian los filtros
  useEffect(() => {
    const resultadosFiltrados = series.filter((serie) => {
      const anioLanzamiento = serie.fecha_lanzamiento
        ? new Date(serie.fecha_lanzamiento).getFullYear()
        : null;

      return (
        (filtros.genero
          ? serie.generos?.some((g) => g.toLowerCase() === filtros.genero.toLowerCase())
          : true) &&
        (filtros.anio ? anioLanzamiento === parseInt(filtros.anio, 10) : true) &&
        (filtros.calificacion
          ? serie.promedio_valoracion >= parseFloat(filtros.calificacion)
          : true)
      );
    });

    setSeriesFiltradas(resultadosFiltrados);
  }, [filtros, series]);

  const handleApplyFilter = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const resetearFiltros = () => {
    setFiltros({ genero: '', anio: '', calificacion: 0 });
  };

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Series</h1>
      {error && <p>{error}</p>}

      <Filtro
        onApplyFilter={handleApplyFilter}
        resetFilters={resetearFiltros}
      />

      <div className="grid">
        {seriesFiltradas.length > 0 ? (
          seriesFiltradas.map((serie) => (
            <Tarjeta
              key={serie._id || serie.id}
              id={serie._id || serie.id}
              titulo={serie.titulo}
              tipo="serie"
              imagen={serie.imagen}
              fecha={serie.fecha_lanzamiento}
              calificacion={serie.promedio_valoracion}
              contexto="obra"
            />
          ))
        ) : (
          <p>No se encontraron series con los filtros aplicados.</p>
        )}
      </div>
    </div>
  );
}
