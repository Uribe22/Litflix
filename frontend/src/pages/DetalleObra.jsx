import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Estrellas from '../components/Estrellas';
import '../styles/DetalleObra.css';

function DetalleObra() {
  const { tipo, id } = useParams();
  const [obra, setObra] = useState(null);
  const [nuevaReseña, setNuevaReseña] = useState('');

  useEffect(() => {
    const obtenerObra = async () => {
      try {
        let endpoint;
        switch (tipo) {
          case 'pelicula':
            endpoint = `http://localhost:5000/api/peliculas`;
            break;
          case 'serie':
            endpoint = `http://localhost:5000/api/series`;
            break;
          case 'libro':
            endpoint = `http://localhost:5000/api/libros`;
            break;
          default:
            throw new Error('Tipo de obra no válido');
        }
  
        const response = await axios.get(endpoint);
        const data = response.data;
        const obraEncontrada = data.find((item) => item._id === id);
  
        if (obraEncontrada) {
          // Calcula el promedio de las valoraciones si existen reseñas
          const valoraciones = obraEncontrada.resenias.map(r => r.valoracion);
          const promedioValoracion = valoraciones.length > 0
            ? (valoraciones.reduce((sum, val) => sum + val, 0) / valoraciones.length).toFixed(1)
            : 0;
  
          // Añade el promedio de valoración al objeto obra
          setObra({ ...obraEncontrada, promedio_valoracion: promedioValoracion });
        } else {
          console.log('Obra no encontrada');
        }
      } catch (error) {
        console.error('Error al obtener los detalles de la obra:', error);
      }
    };
  
    obtenerObra();
  }, [tipo, id]);
  

  const enviarReseña = async () => {
    try {
      const reseñaData = {
        comentario: nuevaReseña,
        valoracion: 5, // Ajusta esto para capturar la calificación deseada
        Id_obra: obra._id,
        Id_usuario: 1, // Usa el ID del usuario autenticado si está disponible
      };
      await axios.post(`http://localhost:5000/api/obra/${obra._id}/resenias`, reseñaData);
  
      const nuevasResenias = [...obra.resenias, reseñaData];
      const valoraciones = nuevasResenias.map(r => r.valoracion);
      const promedioValoracion = valoraciones.length > 0
        ? (valoraciones.reduce((sum, val) => sum + val, 0) / valoraciones.length).toFixed(1)
        : 0;
  
      setObra((prevObra) => ({
        ...prevObra,
        resenias: nuevasResenias,
        promedio_valoracion: promedioValoracion
      }));
      setNuevaReseña('');
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
    }
  };
  

  if (!obra) return <p>Cargando...</p>;

  return (
    <div className="detalle-obra-contenedor">
      <div className="detalle-obra">
        <div className="detalle-obra-header">
          <img src={`http://localhost:5000/imagenes/${obra.imagen}.jpg`} alt={obra.titulo} className="obra-imagen" />
          <div className="detalle-obra-info">
            <h1>{obra.titulo}</h1>
            <p>Director/Autor: {obra.director || obra.creador || obra.autor}</p>
            <p>Productora: {obra.productora}</p>
            <p>Fecha de estreno: {new Date(obra.fecha_estreno || obra.fecha_publicacion).toLocaleDateString()}</p>
            <p className="sinopsis">Sinopsis: {obra.sinopsis}</p>
            <div className="calificacion">
            <Estrellas calificacion={obra.promedio_valoracion || 0} />
            <p>{obra.promedio_valoracion ? `${obra.promedio_valoracion} / 5` : 'No hay valoraciones aún'}</p>
            </div>


            <button className="boton-lista">+ Agregar a lista de pendientes</button>
          </div>
        </div>

        <div className="reseñas">
          <h2>Reseñas</h2>
          {obra.resenias && obra.resenias.length > 0 ? (
            obra.resenias.map((reseña, index) => (
              <div key={index} className="reseña">
                <h4>{reseña.autor}</h4>
                <Estrellas calificacion={reseña.valoracion} />
                <p>{reseña.comentario}</p>
                <span>{new Date(reseña.fecha).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p>No hay reseñas disponibles.</p>
          )}
          <button className="boton-reseñas">Ver más reseñas</button>
        </div>

        <div className="agregar-reseña">
          <h3>Agregar reseña</h3>
          <div className="calificacion">
            <Estrellas idObra={obra._id} />
          </div>
          <textarea 
            placeholder="Escribe tu reseña..." 
            value={nuevaReseña} 
            onChange={(e) => setNuevaReseña(e.target.value)} 
          />
          <button className="boton-enviar" onClick={enviarReseña}>Enviar</button>
        </div>
      </div>
    </div>
  );
}

export default DetalleObra;
