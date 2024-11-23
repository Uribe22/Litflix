import React, { useState } from 'react';
import Estrellas from './Estrellas';
import Carrusel from './Carrusel';
import '../styles/Resenias.css';

export default function Resenias({ resenias, agregarResena, usuarioAutenticado }) {
  const [mostrarListaCompleta, setMostrarListaCompleta] = useState(false);
  const [nuevaReseña, setNuevaReseña] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [expandir, setExpandir] = useState(null);

  const handleVerMasResenias = () => {
    setMostrarListaCompleta(!mostrarListaCompleta);
  };

  const toggleExpandir = (index) => {
    setExpandir(expandir === index ? null : index);
  };

  const enviarReseña = () => {
    if (!usuarioAutenticado) {
      alert('Debes iniciar sesión para agregar una reseña.');
      return;
    }

    if (nuevaReseña.trim() === '' || calificacion === 0) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const nuevaResenaObj = {
      autor: usuarioAutenticado.nombre,
      comentario: nuevaReseña,
      valoracion: calificacion,
      fecha: new Date(),
    };

    agregarResena(nuevaResenaObj);
    setNuevaReseña('');
    setCalificacion(0);
  };

  const renderReseña = (reseña, index) => {
    const esExpandido = expandir === index;
    const textoReseña =
      reseña.comentario.length > 100 && !esExpandido
        ? `${reseña.comentario.substring(0, 100)}...`
        : reseña.comentario;

    return (
      <div key={index} className={`tarjeta-resena ${esExpandido ? 'expandido' : ''}`}>
        <div className="tarjeta-resena-header">
          <div className="tarjeta-resena-avatar">
            <img src="https://via.placeholder.com/50" alt="Avatar" />
          </div>
          <h4 className="tarjeta-resena-autor">{reseña.autor}</h4>
        </div>
        <p className="tarjeta-resena-comentario">{textoReseña}</p>
        {reseña.comentario.length > 100 && (
          <button className="ver-mas-boton" onClick={() => toggleExpandir(index)}>
            {esExpandido ? 'Ver menos' : 'Ver más'}
          </button>
        )}
        <div className="tarjeta-resena-footer">
          <Estrellas calificacion={reseña.valoracion} />
          <span>{new Date(reseña.fecha).toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="reseñas-container">
      <div className="reseñas-header">
        <h2>Reseñas de Usuarios</h2>
      </div>

      {mostrarListaCompleta ? (
        <div className="reseñas-lista-scrollable">
          {resenias.map((reseña, index) => renderReseña(reseña, index))}
        </div>
      ) : (
        resenias && resenias.length > 0 ? (
          <Carrusel
            items={resenias}
            renderItem={(reseña, index) => renderReseña(reseña, index)}
          />
        ) : (
          <p className="reseñas-empty">No hay reseñas disponibles.</p>
        )
      )}

      <button className="boton-reseñas" onClick={handleVerMasResenias}>
        {mostrarListaCompleta ? 'Volver al Carrusel' : 'Ver más reseñas'}
      </button>

      <div className="agregar-reseña">
        <h3>Agregar Reseña</h3>
        <div className="calificacion">
          <Estrellas calificacion={calificacion} setCalificacion={setCalificacion} />
        </div>
        <textarea
          placeholder="Escribe tu reseña..."
          value={nuevaReseña}
          onChange={(e) => setNuevaReseña(e.target.value)}
        />
        <button className="boton-enviar" onClick={enviarReseña}>
          Enviar
        </button>
      </div>
    </div>
  );
}
