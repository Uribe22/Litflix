import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Estrella.css'; // Asegúrate de importar el CSS

export default function Estrellas({ idObra }) {
  const [calificacion, setCalificacion] = useState(null);

  useEffect(() => {
    const obtenerCalificacion = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/calificacion/${idObra}`);
        setCalificacion(response.data.valoracion_promedio);
      } catch (error) {
        console.error('Error al obtener la calificación:', error);
      }
    };

    obtenerCalificacion();
  }, [idObra]);

  const renderizarEstrellas = () => {
    const estrellas = [];
    const calificacionEscalada = calificacion ? calificacion / 2 : 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(calificacionEscalada)) {
        estrellas.push(
          <img key={i} src="/imagenes/estrellas/llena.png" alt="Estrella llena" className="estrella-imagen" />
        );
      } else if (i === Math.ceil(calificacionEscalada) && !Number.isInteger(calificacionEscalada)) {
        estrellas.push(
          <img key={i} src="/imagenes/estrellas/media.png" alt="Estrella media" className="estrella-imagen" />
        );
      } else {
        estrellas.push(
          <img key={i} src="/imagenes/estrellas/vacia.png" alt="Estrella vacía" className="estrella-imagen" />
        );
      }
    }
    return estrellas;
  };

  return (
    <div className="calificacion-estrellas">
      {calificacion !== null ? renderizarEstrellas() : <p className="calificacion-vacia">No hay calificación disponible</p>}
    </div>
  );
}
