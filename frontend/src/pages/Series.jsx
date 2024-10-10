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
            key={serie.Id_obra} // Usa el Id_obra como key
            idObra={serie.Id_obra} // Pasa el idObra al componente
            titulo={serie.titulo}
            urlImagen={serie.imagen}
            calificacion_promedio={serie.promedio_valoracion}  // Usa promedio_valoracion en lugar de rating
            fecha_lanzamiento={serie.fecha_lanzamiento}  // Pasar la fecha de lanzamiento
          />
        ))}
      </div>
    </div>
  );
}
