import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TarjetaObra from '../components/TarjetaObra'; // Asegúrate de que el componente TarjetaObra ya exista

export default function Series() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const obtenerSeries = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3001/api/series');
        setSeries(respuesta.data);
      } catch (error) {
        console.error('Error al obtener las series:', error);
      }
    };

    obtenerSeries();
  }, []);

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Series</h1>
      <div className="grid">
        {series.map((serie) => (
          <TarjetaObra
            key={serie.Id_obra}
            idObra={serie.Id_obra}
            titulo={serie.titulo}
            urlImagen={serie.imagen}
            calificacion_promedio={serie.promedio_valoracion}
            fecha_lanzamiento={serie.fecha_lanzamiento}
          />
        ))}
      </div>
    </div>
  );
}
