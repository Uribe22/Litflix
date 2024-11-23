import React, { useState } from "react";
import Estrellas from "./Estrellas";
import "../styles/Filtro.css";

export default function Filtro({ onApplyFilter }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [genero, setGenero] = useState("");
  const [anio, setAnio] = useState("");
  const [calificacion, setCalificacion] = useState(0);

  const generos = ["Acción", "Drama", "Comedia", "Terror", "Aventura"];
  const anios = Array.from({ length: 23 }, (_, i) => 2000 + i);

  const incrementarCalificacion = () => {
    if (calificacion < 5) setCalificacion((prev) => parseFloat((prev + 0.5).toFixed(1)));
  };

  const decrementarCalificacion = () => {
    if (calificacion > 0) setCalificacion((prev) => parseFloat((prev - 0.5).toFixed(1)));
  };

  const handleApplyFilter = () => {
    if (typeof onApplyFilter === "function") {
      onApplyFilter({ genero, anio, calificacion });
      setDropdownOpen(false);
    } else {
      console.error("onApplyFilter no es una función válida.");
    }
  };

  const handleResetFilter = () => {
    setGenero("");
    setAnio("");
    setCalificacion(0);

    if (typeof onApplyFilter === "function") {
      onApplyFilter({ genero: "", anio: "", calificacion: 0 });
    }
  };

  return (
    <div className="dropdown-container">
      <button
        className="dropdown-button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        Filtros <span className="caret"></span>
      </button>

      {dropdownOpen && (
        <div className="dropdown-content">
          <h4>Filtrar por:</h4>

          {/* Filtro por Género */}
          <div className="filter-group">
            <label htmlFor="genero-select">Género:</label>
            <select
              id="genero-select"
              className="filter-select"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              <option value="">Todos</option>
              {generos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Año */}
          <div className="filter-group">
            <label htmlFor="anio-select">Año de lanzamiento:</label>
            <select
              id="anio-select"
              className="filter-select"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
            >
              <option value="">Todos</option>
              {anios.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Calificación */}
          <div className="filter-group">
            <label>Calificación Mínima:</label>
            <div className="calificacion-controls">
              <button
                className="calificacion-button"
                onClick={decrementarCalificacion}
                disabled={calificacion <= 0}
              >
                -
              </button>
              <Estrellas calificacion={calificacion} />
              <button
                className="calificacion-button"
                onClick={incrementarCalificacion}
                disabled={calificacion >= 5}
              >
                +
              </button>
            </div>
          </div>

          {/* Botones de Aplicar y Resetear */}
          <button className="filter-apply-button" onClick={handleApplyFilter}>
            Aplicar Filtro
          </button>
          <button className="filter-reset-button" onClick={handleResetFilter}>
            Resetear Filtros
          </button>
        </div>
      )}
    </div>
  );
}
