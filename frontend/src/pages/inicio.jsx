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
        setMejorValoradas(resMejorValoradas.data);

        const resUltimosEstrenos = await axios.get('http://localhost:3001/api/ultimos-estrenos');
        setUltimosEstrenos(resUltimosEstrenos.data);

        const resMasResenadas = await axios.get('http://localhost:3001/api/mas-resenadas');
        setMasResenadas(resMasResenadas.data);

      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    obtenerDatos();
  }, []);

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Mejor Valoradas</h1>
      <div className="grid">
        {mejorValoradas.map((obra, index) => (
         <TarjetaObra
         key={obra.Id_obra}
         idObra={obra.Id_obra}
         titulo={obra.titulo}
         urlImagen={obra.imagen}
         calificacion_promedio={obra.promedio_valoracion}
         fecha_lanzamiento={obra.fecha_publicacion}
       />
        ))}
      </div>

      <h1 className="titulo-tipo">Últimos Estrenos</h1>
      <div className="grid">
        {ultimosEstrenos.map((obra, index) => (
          <TarjetaObra
          key={obra.Id_obra}
          idObra={obra.Id_obra}
          titulo={obra.titulo}
          urlImagen={obra.imagen}
          calificacion_promedio={obra.promedio_valoracion}
          fecha_lanzamiento={obra.fecha_lanzamiento}
        />
        ))}
      </div>

      <h1 className="titulo-tipo">Más Reseñadas</h1>
      <div className="grid">
        {masResenadas.map((obra, index) => (
           <TarjetaObra
           key={obra.Id_obra}
           idObra={obra.Id_obra}
           titulo={obra.titulo}
           urlImagen={obra.imagen}
           calificacion_promedio={obra.promedio_valoracion}
           fecha_lanzamiento={obra.fecha_lanzamiento}
         />
        ))}
      </div>
    </div>
  );
}
