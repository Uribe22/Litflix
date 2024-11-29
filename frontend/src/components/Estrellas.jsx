import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/Estrella.css';

export default function Estrellas({ calificacion, setCalificacion, interactiva = false }) {
  const [hover, setHover] = useState(0);

  const renderizarEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <FaStar
          key={i}
          className={`estrella ${i <= (hover || calificacion) ? 'llena' : 'vacia'}`}
          onMouseEnter={() => interactiva && setHover(i)}
          onMouseLeave={() => interactiva && setHover(0)}
          onClick={() => interactiva && setCalificacion(calificacion === i ? 0 : i)} // Permite seleccionar 0
        />
      );
    }
    return estrellas;
  };

  return <div className="calificacion-estrellas">{renderizarEstrellas()}</div>;
}
