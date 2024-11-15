import React from 'react';
import Estrellas from './Estrellas'; 
import Carrusel from './Carrusel';

export default function Resenias({ resenias }) {
  const renderResena = (reseña) => (
    <div className="p-2">
      <div className="w-full h-full border p-6 flex flex-col rounded-lg shadow-lg bg-white">
        <div className="flex items-start mb-4">
          <div className="flex-grow">
            <h4 className="calificacion-usuario">{reseña.autor}</h4>
          </div>
        </div>
        <div className="calificacion-usuario mb-2">
          <Estrellas calificacion={reseña.valoracion} />
        </div>
        <p className="text-gray-700 mb-4 flex-grow text-sm">{reseña.comentario}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
        <span style={{ color: '#224160;' }}>{reseña.fecha ? new Date(reseña.fecha).toLocaleDateString() : 'Fecha no disponible'}</span>

        </div>
      </div>
    </div>
  );

  return (
    <div className="reseñas w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Reseñas de Usuarios</h2>
        <button className="text-blue-600 hover:underline boton-reseñas">Ver más reseñas</button>
      </div>
      {resenias && resenias.length > 0 ? (
        <Carrusel items={resenias} renderItem={renderResena} />
      ) : (
        <p className="text-white">No hay reseñas disponibles.</p>
      )}
    </div>
  );
}
