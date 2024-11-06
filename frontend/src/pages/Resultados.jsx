import React from 'react'; 
import { useLocation } from 'react-router-dom';
import TarjetaObra from '../components/TarjetaObra';

export default function Resultados() {
    const location = useLocation();
    const { resultados, termino } = location.state || { resultados: [], termino: '' };

    console.log('Datos recibidos en Resultados:', resultados);

    return (
        <div className="contenedor">
            <h1 className="titulo-tipo">Resultados de búsqueda para "{termino}"</h1>
            <div className="grid">
                {resultados.length > 0 ? (
                    resultados.map((obra) => (
                        <TarjetaObra
                            key={obra._id || obra.id} 
                            titulo={obra.titulo}
                            imagen={obra.imagen}
                            fecha_publicacion={obra.fecha}
                            calificacion_promedio={obra.promedio_valoracion}
                        />
                    ))
                ) : (
                    <h1 className="titulo-tipo">No se encontraron resultados para "{termino}"</h1>
                )}
            </div>
        </div>
    );
}
