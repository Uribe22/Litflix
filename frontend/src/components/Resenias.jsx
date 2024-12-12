import React, { useState } from "react";
import axios from "axios";
import { renovarTokenSiEsNecesario } from "../utils/gestorDeTokens";
import Swal from "sweetalert2";
import Estrellas from "./Estrellas";
import Carrusel from "./Carrusel";
import "../styles/Resenias.css";

export default function Resenias({ resenias, tipo, idRelacionado, usuarioAutenticado,agregarResenaLocalmente}) {
  const [mostrarListaCompleta, setMostrarListaCompleta] = useState(false);
  const [nuevaReseña, setNuevaReseña] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [expandir, setExpandir] = useState(null);

  const handleVerMasResenias = () => {
    setMostrarListaCompleta(!mostrarListaCompleta);
  };

  const toggleExpandir = (index) => {
    setExpandir(expandir === index ? null : index);
  };
  const enviarReseña = async () => {
    if (!usuarioAutenticado) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar una reseña.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/inicio-sesion"; // Redirige al login
        }
      });
      
      return;
    }
  
    if (!nuevaReseña.trim() || calificacion === 0) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de enviar tu reseña.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }
  
    try {
      const token = await renovarTokenSiEsNecesario();
      if (!token) {
        Swal.fire({
          title: "Sesión expirada",
          text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      const nuevaResenaObj = {
        autor: usuarioAutenticado.nombre,
        comentario: nuevaReseña,
        valoracion: calificacion,
        fecha: new Date(),
        
      };
      

  
      const response = await axios.post(
        `http://localhost:5000/api/resenias`,
        {
          ...nuevaResenaObj,
          tipo,
          idRelacionado,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      Swal.fire({
        title: "¡Reseña enviada!",
        text: "Tu reseña se agregó correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
  
      setNuevaReseña("");
      setCalificacion(0);
  
      // Actualiza las reseñas localmente
      agregarResenaLocalmente(response.data.reseña);
    } catch (error) {
      console.error("Error al enviar la reseña:", error.response || error);
      Swal.fire({
        title: "Error al enviar reseña",
        text: "Hubo un problema al enviar tu reseña. Por favor, inténtalo nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };
  
  const renderReseña = (reseña, index) => {
    const esExpandido = expandir === index;
    const textoReseña =
      reseña.comentario.length > 100 && !esExpandido
        ? `${reseña.comentario.substring(0, 100)}...`
        : reseña.comentario;

    return (
      <div key={index} className={`tarjeta-resena ${esExpandido ? "expandido" : ""}`}>
        <div className="tarjeta-resena-header">
          <div className="tarjeta-resena-avatar">
            <img src="https://via.placeholder.com/50" alt="Avatar" />
          </div>
          <h4 className="tarjeta-resena-autor">{reseña.autor}</h4>
        </div>
        <p className="tarjeta-resena-comentario">{textoReseña}</p>
        {reseña.comentario.length > 100 && (
          <button className="ver-mas-boton" onClick={() => toggleExpandir(index)}>
            {esExpandido ? "Ver menos" : "Ver más"}
          </button>
        )}
        <div className="tarjeta-resena-footer">
          <Estrellas calificacion={reseña.valoracion} interactiva={false} />
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
      ) : resenias && resenias.length > 0 ? (
        <Carrusel items={resenias} renderItem={(reseña, index) => renderReseña(reseña, index)} />
      ) : (
        <p className="reseñas-empty">No hay reseñas disponibles.</p>
      )}

      <button className="boton-reseñas" onClick={handleVerMasResenias}>
        {mostrarListaCompleta ? "Volver al Carrusel" : "Ver más reseñas"}
      </button>

      <div className="agregar-reseña">
        <h3>Agregar Reseña</h3>
        <div className="calificacion">
          <Estrellas calificacion={calificacion} setCalificacion={setCalificacion} interactiva={true} />
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
document.addEventListener("DOMContentLoaded", function() {
  const botonesVerMas = document.querySelectorAll('.ver-mas-boton');
  
  botonesVerMas.forEach(function(boton) {
    boton.addEventListener('click', function() {
      const tarjeta = boton.closest('.tarjeta-resena');
      tarjeta.classList.toggle('expandido');
    
      if (tarjeta.classList.contains('expandido')) {
        boton.textContent = 'Ver menos';
      } else {
        boton.textContent = 'Ver más';
      }
    });
  });
});
