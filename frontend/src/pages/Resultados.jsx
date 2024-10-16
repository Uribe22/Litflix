import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import TarjetaObra from '../components/TarjetaObra';

export default function Resultados() {
  const location = useLocation();
  const { resultados, termino } = location.state || { resultados: [], termino: '' };

  return (
    <div className="contenedor">
      <h1 className="titulo-tipo">Resultados de búsqueda para "{termino}"</h1>
      <div className="grid">
        {resultados.length > 0 ? (
          resultados.map((obra) => (
            <TarjetaObra
              key={obra.Id_obra}
              idObra={obra.Id_obra}
              titulo={obra.titulo}
              urlImagen={obra.imagen}
              calificacion_promedio={obra.valoracion_promedio}
              fecha_lanzamiento={obra.fecha_lanzamiento}
            />
          ))
        ) : (
          <div className="sin-resultados">
            <p>Ups, de momento no tenemos esa obra. <Link to="/">Volver</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
