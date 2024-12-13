import React, { useEffect, useState } from 'react';
import Tarjeta from '../components/Tarjeta';
import Filtro from '../components/Filtro';

export default function Series({ resultadosBusqueda, terminoBusqueda, onSearch }) {
  const [series, setSeries] = useState([]);
  const [seriesFiltradas, setSeriesFiltradas] = useState([]);
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
        setSeriesFiltradas(seriesConValoracion);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerSeries();
  }, []);

  useEffect(() => {
    let resultados = series;

    // Aplicar búsqueda
    if (resultadosBusqueda && terminoBusqueda) {
      resultados = resultadosBusqueda;
    }

    // Aplicar filtros
    const resultadosFiltrados = resultados.filter((serie) => {
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
  }, [resultadosBusqueda, terminoBusqueda, filtros, series]);

  const aplicarFiltros = (nuevosFiltros) => {
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
        onApplyFilter={aplicarFiltros}
        resetFilters={resetearFiltros}
      />
       {terminoBusqueda && (
        <p className="resultado-busquedas">
          Resultados para "{terminoBusqueda}":
        </p>
      )}


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
            <p className="sin-resultados">
              {terminoBusqueda
                ? `No se encontraron resultados para "${terminoBusqueda}".`
                : "No se encontraron series con los filtros aplicados."}
            </p>
          )}
        </div>
      </div>
    );
  }
  