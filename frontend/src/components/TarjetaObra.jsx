import '../styles/Tarjetas.css';
import React from 'react';
import Estrellas from './Estrellas';

export default function TarjetaObra({ idObra, titulo, imagen, fecha_lanzamiento, calificacion_promedio }) {
  const imagenFinal = `http://localhost:5000/imagenes/${imagen}.jpg`;

  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  return (
    <div className="tarjeta-obra">
      <img src={imagenFinal} alt={titulo} className="tarjeta-obra-imagen" />
      <div className="p-4">
        <h3>{titulo}</h3>
        {fecha_lanzamiento && (
          <p className="fecha-publicacion">
            {formatearFecha(fecha_lanzamiento)}
          </p>
        )}
        <Estrellas idObra={idObra} calificacion={calificacion_promedio} />
      </div>
    </div>
  );
}
