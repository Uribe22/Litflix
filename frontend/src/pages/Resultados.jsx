import React from 'react'; 
import { useLocation } from 'react-router-dom';
import Tarjeta from '../components/Tarjeta'; 

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
                        <Tarjeta
                            key={obra._id || obra.id}
                            id={obra._id || obra.id}
                            titulo={obra.titulo}
                            tipo={obra.tipo}
                            imagen={obra.imagen}
                            fecha={obra.fecha_lanzamiento || obra.fecha}
                            calificacion={obra.promedio_valoracion}
                            contexto="obra"
                        />
                    ))
                ) : (
                    <h2 className="titulo-tipo">No se encontraron resultados para "{termino}"</h2>
                )}
            </div>
        </div>
    );
}
