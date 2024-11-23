import React, { useEffect, useState } from 'react';
import Tarjeta from '../components/Tarjeta';
import Filtro from '../components/Filtro';

export default function Libros() {
  const [libros, setLibros] = useState([]);
  const [librosFiltrados, setLibrosFiltrados] = useState([]);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    genero: '',
    anio: '',
    calificacion: 0,
  });

  useEffect(() => {
    const obtenerLibros = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/libros');
        if (!response.ok) {
          throw new Error('Error en la carga de libros');
        }
        const data = await response.json();

        const librosConValoracion = data.map((libro) => {
          const valoraciones = libro.resenias.map((r) => r.valoracion);
          const promedio =
            valoraciones.length > 0
              ? (valoraciones.reduce((sum, val) => sum + val, 0) / valoraciones.length).toFixed(1)
              : 0;

          return { ...libro, promedio_valoracion: promedio };
        });

        setLibros(librosConValoracion);
        setLibrosFiltrados(librosConValoracion);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerLibros();
  }, []);

  useEffect(() => {
    const resultadosFiltrados = libros.filter((libro) => {
      const anioLanzamiento = libro.fecha_lanzamiento
        ? new Date(libro.fecha_lanzamiento).getFullYear()
        : null;

      return (
        (filtros.genero
          ? libro.generos?.some((g) => g.toLowerCase() === filtros.genero.toLowerCase())
          : true) &&
        (filtros.anio ? anioLanzamiento === parseInt(filtros.anio, 10) : true) &&
        (filtros.calificacion
          ? libro.promedio_valoracion >= parseFloat(filtros.calificacion)
          : true)
      );
    });

    setLibrosFiltrados(resultadosFiltrados);
  }, [filtros, libros]);

  const handleApplyFilter = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const resetearFiltros = () => {
    setFiltros({ genero: '', anio: '', calificacion: 0 });
  };

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Libros</h1>
      {error && <p>{error}</p>}

      <Filtro
        onApplyFilter={handleApplyFilter}
        resetFilters={resetearFiltros}
      />

      <div className="grid">
        {librosFiltrados.length > 0 ? (
          librosFiltrados.map((libro) => (
            <Tarjeta
              key={libro._id || libro.id}
              id={libro._id || libro.id}
              titulo={libro.titulo}
              tipo="libro"
              imagen={libro.imagen}
              fecha={libro.fecha_lanzamiento}
              calificacion={libro.promedio_valoracion}
              contexto="obra"
            />
          ))
        ) : (
          <p>No se encontraron libros con los filtros aplicados.</p>
        )}
      </div>
    </div>
  );
}
