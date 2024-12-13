import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Asegúrate de importar useLocation correctamente
import Tarjeta from "../components/Tarjeta";
import Filtro from "../components/Filtro";

export default function Resultados({ onClearSearch }) {
  const location = useLocation(); // Usa useLocation correctamente
  const { resultados, termino } = location.state || { resultados: [], termino: "" };

  const [resultadosBusqueda, setResultadosBusqueda] = useState(resultados);
  const [terminoBusqueda, setTerminoBusqueda] = useState(termino);
  const [filtros, setFiltros] = useState({
    genero: "",
    anio: "",
    calificacion: "",
  });

  // Aseguramos que los resultados se actualicen correctamente al realizar una nueva búsqueda
  useEffect(() => {
    if (resultados && resultados.length > 0) {
      setResultadosBusqueda(resultados);
    }
  }, [resultados]);

  // Limpiar los resultados de la búsqueda cuando la página se recarga o el término cambia
  useEffect(() => {
    onClearSearch(); // Limpiar cualquier búsqueda previa cuando se recarga o navega
  }, [onClearSearch]);

  // Función de búsqueda en tiempo real
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTerminoBusqueda(value);

    if (value.trim() === "") {
      setResultadosBusqueda(resultados); // Si el campo de búsqueda está vacío, mostramos todos los resultados
    } else {
      // Filtrar resultados basados en el término de búsqueda
      const resultadosFiltrados = resultados.filter((obra) =>
        obra.titulo.toLowerCase().includes(value.toLowerCase())
      );
      setResultadosBusqueda(resultadosFiltrados);
    }
  };

  // Aplicar filtros a los resultados
  useEffect(() => {
    const resultadosFiltrados = resultadosBusqueda.filter((obra) => {
      const anioLanzamiento = obra.fecha_lanzamiento
        ? new Date(obra.fecha_lanzamiento).getFullYear()
        : null;

      return (
        (filtros.genero
          ? obra.generos?.some((g) => g.toLowerCase() === filtros.genero.toLowerCase())
          : true) &&
        (filtros.anio ? anioLanzamiento === parseInt(filtros.anio, 10) : true) &&
        (filtros.calificacion
          ? obra.promedio_valoracion >= parseFloat(filtros.calificacion)
          : true)
      );
    });

    setResultadosBusqueda(resultadosFiltrados);
  }, [filtros, resultadosBusqueda]);

  const aplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const resetearFiltros = () => {
    setFiltros({ genero: "", anio: "", calificacion: "" });
  };

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Resultados de búsqueda para "{terminoBusqueda}"</h1>

      {/* Campo de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          value={terminoBusqueda}
          onChange={handleSearchChange}
          placeholder="Buscar en los resultados..."
        />
      </div>

      {/* Filtro */}
      <Filtro onApplyFilter={aplicarFiltros} resetFilters={resetearFiltros} />

      <div className="grid">
        {resultadosBusqueda.length > 0 ? (
          resultadosBusqueda.map((obra) => (
            <Tarjeta
              key={obra._id || obra.id}
              id={obra._id || obra.id}
              titulo={obra.titulo}
              tipo={obra.tipo}
              imagen={obra.imagen}
              fecha={obra.fecha_lanzamiento || obra.fecha}
              calificacion={obra.promedio_valoracion}
              contexto="obra"
            />
          ))
        ) : (
          <h2 className="titulo-tipo">No se encontraron resultados para "{terminoBusqueda}"</h2>
        )}
      </div>
    </div>
  );
}
