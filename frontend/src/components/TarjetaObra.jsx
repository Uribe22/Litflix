import React from 'react';
import Estrellas from './Estrellas';

export default function TarjetaObra({ titulo, urlImagen, calificacion_promedio }) {
  const imagenFinal = `http://localhost:3001${urlImagen}`;

  return (
    <div className="tarjeta-obra">
      <img src={imagenFinal} alt={titulo} className="tarjeta-obra-imagen" />
      <div className="p-4">
        <h3>{titulo}</h3>
        <Estrellas calificacion={calificacion_promedio} />  {/* calificación promedio */}
      </div>
    </div>
  );
}
