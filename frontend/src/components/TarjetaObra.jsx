import '../styles/Tarjetas.css';
import React from 'react';
import Estrellas from './Estrellas';

export default function TarjetaObra({ idObra, titulo, urlImagen, calificacion_promedio, fecha_lanzamiento }) {
  const imagenFinal = `http://localhost:3001${urlImagen}`;

  // Formatear la fecha de lanzamiento
  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  return (
    <div className="tarjeta-obra">
      <img src={imagenFinal} alt={titulo} className="tarjeta-obra-imagen" />
      <div className="p-4">
        <h3>{titulo}</h3>
        <Estrellas idObra={idObra} />
        {fecha_lanzamiento && (
          <p className="fecha-lanzamiento">
            {formatearFecha(fecha_lanzamiento)}
          </p>
        )}
      </div>
    </div>
  );
}
