import React, { useEffect, useState } from "react";
import Tarjeta from "../components/Tarjeta";
import Filtro from "../components/Filtro";

export default function Peliculas({ resultadosBusqueda, terminoBusqueda, onSearch }) {
  const [peliculas, setPeliculas] = useState([]); // Todas las películas
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]); // Películas mostradas en pantalla
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState({
    genero: "",
    anio: "",
    calificacion: "",
  });

  // Cargar todas las películas al montar el componente
  useEffect(() => {
    const obtenerPeliculas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/peliculas");
        if (!response.ok) throw new Error("Error en la carga de películas");
        const data = await response.json();

        // Calcular promedio de valoraciones
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
        setPeliculasFiltradas(peliculasConValoracion); // Inicialmente mostramos todas
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerPeliculas();
  }, []);

  // Actualizar los resultados de búsqueda y aplicar filtros
  useEffect(() => {
    let resultados = peliculas;

    // Aplicar búsqueda
    if (resultadosBusqueda && terminoBusqueda) {
      resultados = resultadosBusqueda;
    }

    // Aplicar filtros
    const resultadosFiltrados = resultados.filter((pelicula) => {
      const anioLanzamiento = pelicula.fecha_lanzamiento
        ? new Date(pelicula.fecha_lanzamiento).getFullYear()
        : null;

      return (
        (filtros.genero
          ? pelicula.generos?.some((g) =>
              g.toLowerCase() === filtros.genero.toLowerCase()
            )
          : true) &&
        (filtros.anio
          ? anioLanzamiento === parseInt(filtros.anio, 10)
          : true) &&
        (filtros.calificacion
          ? pelicula.promedio_valoracion >= parseFloat(filtros.calificacion)
          : true)
      );
    });

    setPeliculasFiltradas(resultadosFiltrados);
  }, [resultadosBusqueda, terminoBusqueda, filtros, peliculas]);

  const aplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const resetearFiltros = () => {
    setFiltros({ genero: "", anio: "", calificacion: "" });
    setPeliculasFiltradas(peliculas); // Reiniciar la lista completa
  };

  return (
    <div className="contenedor-inicio">
      <h1 className="titulo-tipo">Películas</h1>
      {error && <p>{error}</p>}

      {/* Filtro */}
      <Filtro onApplyFilter={aplicarFiltros} resetFilters={resetearFiltros} />

      {terminoBusqueda && (
        <p className="resultado-busquedas">
          Resultados para "{terminoBusqueda}":
        </p>
      )}

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
            {terminoBusqueda
              ? `No se encontraron resultados para "${terminoBusqueda}".`
              : "No se encontraron películas con los filtros aplicados."}
          </p>
        )}
      </div>
    </div>
  );
}
