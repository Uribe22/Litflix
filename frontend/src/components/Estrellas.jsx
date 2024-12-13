import React, { useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import "../styles/Estrella.css";

export default function Estrellas({ calificacion, setCalificacion, interactiva = false }) {
  const [hover, setHover] = useState(0);

  const renderizarEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      const isHalfStar = (i - 0.5) <= (hover || calificacion) && (i > (hover || calificacion));
      const isFullStar = i <= (hover || calificacion);
      
      if (isFullStar) {
        estrellas.push(
          <FaStar
            key={i}
            className="estrella llena"
            onMouseEnter={() => interactiva && setHover(i)}
            onMouseLeave={() => interactiva && setHover(0)}
            onClick={() => interactiva && setCalificacion(i)}
          />
        );
      } else if (isHalfStar) {
        estrellas.push(
          <FaStarHalfAlt
            key={i}
            className="estrella media"
            onMouseEnter={() => interactiva && setHover(i)}
            onMouseLeave={() => interactiva && setHover(0)}
            onClick={() => interactiva && setCalificacion(i - 0.5)}
          />
        );
      } else {
        estrellas.push(
          <FaStar
            key={i}
            className="estrella vacia"
            onMouseEnter={() => interactiva && setHover(i)}
            onMouseLeave={() => interactiva && setHover(0)}
            onClick={() => interactiva && setCalificacion(i === 1 ? 0 : i - 1)}
          />
        );
      }
    }
    return estrellas;
  };

  return <div className="calificacion-estrellas">{renderizarEstrellas()}</div>;
}
