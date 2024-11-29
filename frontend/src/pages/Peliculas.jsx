import React, { useEffect, useState } from "react";
import Tarjeta from "../components/Tarjeta";
import Filtro from "../components/Filtro";

export default function Peliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState({
    genero: "",
    anio: "", 
    calificacion: "",
  });

  // Obtener películas al cargar el componente
  useEffect(() => {
    const obtenerPeliculas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/peliculas");
        if (!response.ok) {
          throw new Error("Error en la carga de películas");
        }
        const data = await response.json();

        const peliculasConValoracion = data.map((pelicula) => {
          const valoraciones = pelicula.resenias.map((r) => r.valoracion);
          const promedio =
            valoraciones.length > 0
              ? (
                  valoraciones.reduce((sum, val) => sum + val, 0) /
                  valoraciones.length
                ).toFixed(1)
              : 0;

          return { ...pelicula, promedio_valoracion: promedio };
        });

        setPeliculas(peliculasConValoracion);
        setPeliculasFiltradas(peliculasConValoracion);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerPeliculas();
  }, []);

  // Filtrar películas cuando cambian los filtros
  useEffect(() => {
    const resultadosFiltrados = peliculas.filter((pelicula) => {
      const anioLanzamiento = pelicula.fecha_lanzamiento
        ? new Date(pelicula.fecha_lanzamiento).getFullYear()
        : null;

      return (
        (filtros.genero
          ? pelicula.generos?.some((g) =>
              g.toLowerCase() === filtros.genero.toLowerCase()
            )
          : true) &&
        (filtros.anio // Aquí aseguramos que anio sea el mismo nombre
          ? anioLanzamiento === parseInt(filtros.anio, 10)
          : true) &&
        (filtros.calificacion
          ? pelicula.promedio_valoracion >= parseFloat(filtros.calificacion)
          : true)
      );
    });

    setPeliculasFiltradas(resultadosFiltrados);
  }, [filtros, peliculas]);

  // Manejar la aplicación de filtros
  const handleApplyFilter = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  // Resetear filtros
  const resetearFiltros = () => {
    setFiltros({ genero: "", anio: "", calificacion: "" });
  };

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Películas</h1>
      {error && <p>{error}</p>}

      <Filtro
        onApplyFilter={handleApplyFilter}
        resetFilters={resetearFiltros}
      />

      <div className="grid">
        {peliculasFiltradas.length > 0 ? (
          peliculasFiltradas.map((pelicula) => (
            <Tarjeta
              key={pelicula._id || pelicula.id}
              id={pelicula._id || pelicula.id}
              titulo={pelicula.titulo}
              tipo="pelicula"
              imagen={pelicula.imagen}
              fecha={pelicula.fecha_lanzamiento}
              calificacion={pelicula.promedio_valoracion}
              contexto="obra"
            />
          ))
        ) : (
          <p className="sin-resultados">
            No se encontraron películas con los filtros aplicados.
          </p>
        )}
      </div>
    </div>
  );
}
