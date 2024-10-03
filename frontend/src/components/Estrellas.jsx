import React from 'react';

export default function Estrellas({ calificacion }) {
  const calificacionEscalada = Math.round(calificacion / 2); // Redondeo al número más cercano

  const renderizarEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= calificacionEscalada) {
        estrellas.push(<span key={i}>&#9733;</span>); // Estrella llena
      } else {
        estrellas.push(<span key={i}>&#9734;</span>); // Estrella vacía
      }
    }
    return estrellas;
  };

  return (
    <div className="calificacion-estrellas">
      {renderizarEstrellas()}
    </div>
  );
}
