import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../styles/Estrella.css';

export default function Estrellas({ calificacion }) {
  const renderizarEstrellas = () => {
    const estrellas = [];
    const calificacionEscalada = calificacion || 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(calificacionEscalada)) {
        estrellas.push(<FaStar key={i} className="estrella llena" />);
      } else if (i === Math.ceil(calificacionEscalada) && calificacionEscalada % 1 >= 0.5) {
        estrellas.push(<FaStarHalfAlt key={i} className="estrella media" />);
      } else {
        estrellas.push(<FaRegStar key={i} className="estrella vacia" />);
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
