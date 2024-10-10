import '../styles/Estrella.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // Importar íconos de FontAwesome

export default function Estrellas({ idObra }) {
  const [calificacion, setCalificacion] = useState(null);

  useEffect(() => {
    // Llamada al backend para obtener la calificación promedio de la obra
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
    const calificacionEscalada = calificacion ? calificacion / 2 : 0;  // Escala de 0-5

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(calificacionEscalada)) {
        estrellas.push(<FaStar key={i} className="estrella-personalizada" />); // Estrella llena
      } else if (i === Math.ceil(calificacionEscalada) && !Number.isInteger(calificacionEscalada)) {
        estrellas.push(<FaStarHalfAlt key={i} className="estrella-personalizada" />); // Media estrella
      } else {
        estrellas.push(<FaRegStar key={i} className="estrella-personalizada" />); // Estrella vacía
      }
    }
    return estrellas;
  };

  return (
    <div className="calificacion-estrellas">
      {calificacion !== null ? renderizarEstrellas() :<p className="calificacion-vacia">No hay calificación disponible</p>}
    </div>
  );
}
