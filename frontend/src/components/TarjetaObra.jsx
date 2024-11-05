import '../styles/Tarjetas.css';
import React from 'react';

const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
};

export default function TarjetaObra({ titulo, autor, imagen, fecha_publicacion, fecha_estreno }) {
    const imagenFinal = `http://localhost:5000/imagenes/${imagen}.jpg`;

    return (
        <div className="tarjeta-obra">
            <img src={imagenFinal} alt={titulo} className="tarjeta-obra-imagen" />
            <div className="p-4">
                <h3>{titulo}</h3>
                {autor && <p>Autor: {autor}</p>}
                
                {/* Mostrar solo la fecha sin texto adicional */}
                {fecha_publicacion && (
                    <p className="fecha">
                        {formatearFecha(fecha_publicacion)}
                    </p>
                )}
                {fecha_estreno && (
                    <p className="fecha">
                        {formatearFecha(fecha_estreno)}
                    </p>
                )}
            </div>
        </div>
    );
}
