import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TarjetaObra from '../components/TarjetaObra';

export default function Inicio() {
  const [mejorValoradas, setMejorValoradas] = useState([]);
  const [ultimosEstrenos, setUltimosEstrenos] = useState([]);
  const [masResenadas, setMasResenadas] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const resMejorValoradas = await axios.get('http://localhost:3001/api/mejor-valoradas');
        const resUltimosEstrenos = await axios.get('http://localhost:3001/api/ultimos-estrenos');
        const resMasResenadas = await axios.get('http://localhost:3001/api/mas-reseñadas');

        // Guardar los datos obtenidos
        setMejorValoradas(resMejorValoradas.data);
        setUltimosEstrenos(resUltimosEstrenos.data);
        setMasResenadas(resMasResenadas.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  // Función para calcular el promedio de calificaciones basado en las reseñas
  const calcularPromedio = (reseñas) => {
    if (reseñas.length === 0) return 0;
    const total = reseñas.reduce((sum, reseña) => sum + reseña.valoracion, 0);
    return total / reseñas.length;
  };

  return (
    <div className="contenedor">
      {/* Sección Mejor Valoradas */}
      <h1 className="titulo-tipo">Mejor Valoradas</h1>
      <div className="grid">
        {mejorValoradas.map((obra, index) => (
          <TarjetaObra
            key={index}
            titulo={obra.titulo}
            urlImagen={obra.imagen}
            calificacion_promedio={calcularPromedio(obra.reseñas)} // Pasamos el promedio de las reseñas
          />
        ))}
      </div>

      {/* Sección Últimos Estrenos */}
      <h1 className="titulo-tipo">Últimos Estrenos</h1>
      <div className="grid">
        {ultimosEstrenos.map((obra, index) => (
          <TarjetaObra
            key={index}
            titulo={obra.titulo}
            urlImagen={obra.imagen}
            calificacion_promedio={null}  // No hay calificación aquí
          />
        ))}
      </div>

      {/* Sección Más Reseñadas */}
      <h1 className="titulo-tipo">Más Reseñadas</h1>
      <div className="grid">
        {masResenadas.map((obra, index) => (
          <TarjetaObra
            key={index}
            titulo={obra.titulo}
            urlImagen={obra.imagen}
            calificacion_promedio={calcularPromedio(obra.reseñas)}  // Pasamos el promedio de las reseñas
          />
        ))}
      </div>
    </div>
  );
}
