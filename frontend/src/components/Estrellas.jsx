import React from 'react';
import '../styles/Estrella.css';

export default function Estrellas({ calificacion }) {
  const renderizarEstrellas = () => {
    const estrellas = [];
    const calificacionEscalada = calificacion || 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(calificacionEscalada)) {
        estrellas.push(
          <img key={i} src="/iconos/estrella_llena.png" alt="Estrella llena" className="estrella-imagen" />
        );
      } else if (i === Math.ceil(calificacionEscalada) && calificacionEscalada % 1 >= 0.5) {
        estrellas.push(
          <img key={i} src="/iconos/estrella_media.png" alt="Estrella media" className="estrella-imagen" />
        );
      } else {
        estrellas.push(
          <img key={i} src="/iconos/estrella_vacia.png" alt="Estrella vacía" className="estrella-imagen" />
        );
      }
    }
    return estrellas;
  };

  return (
    <div className="calificacion-estrellas">
      {calificacion !== null ? (
        <>
          {renderizarEstrellas()}
        </>
      ) : (
        <p className="calificacion-vacia">No hay calificación disponible</p>
      )}
    </div>
  );
}
