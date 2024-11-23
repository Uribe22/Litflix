import '../styles/Obras.css';
import React from 'react';
import Estrellas from './Estrellas';
import { Link } from 'react-router-dom';

export default function Tarjeta({ 
  id, 
  titulo, 
  imagen, 
  comentario, 
  calificacion, 
  fecha, 
  contexto, 
  tipo 
}) {
  const imagenFinal = imagen ? `http://localhost:5000/imagenes/${imagen}.jpg` : null;

  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return fecha ? new Date(fecha).toLocaleDateString('es-ES', opciones) : 'Fecha no disponible';
  };

  return (
    <div className={`tarjeta-obra ${contexto}`}>
    {contexto === 'obra' && (
      <Link to={`/detalleobra/${tipo}/${id}`} className="sin-subrayado">
        <img src={imagenFinal} alt={titulo} className="tarjeta-obra-imagen" />
        <div className="p-4">
          <h3>{titulo}</h3>
          {fecha && <p className="fecha-publicacion">{formatearFecha(fecha)}</p>}
          <Estrellas calificacion={calificacion} />
        </div>
      </Link>
    )}
    {contexto === 'resena' && (
      <div className="tarjeta-resena-content">
        <h4 className="tarjeta-resena-autor">
          {titulo} <span className="tarjeta-resena-verificado">✔</span>
        </h4>
        <p className="tarjeta-resena-comentario">{comentario}</p>
        <div className="tarjeta-resena-footer">
          <Estrellas calificacion={calificacion} />
          <span className="tarjeta-resena-fecha">{formatearFecha(fecha)}</span>
        </div>
      </div>
    )}
  </div>
  
  );
}
