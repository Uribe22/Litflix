import React from 'react';

export default function Estrellas({ calificacion }) {
  // Convertir la calificación de 1-10 a una escala de 0-5 dividiendo entre 2
  const calificacionEscalada = calificacion / 2;

  const renderizarEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= calificacionEscalada) {
        estrellas.push(<span key={i}>&#9733;</span>); // Estrella llena
      } else if (i - calificacionEscalada === 0.5) {
        estrellas.push(<span key={i}>&#189;</span>); // Media estrella
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
