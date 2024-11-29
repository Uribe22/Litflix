import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Estrellas from "../components/Estrellas";
import Resenias from "../components/Resenias";
import "../styles/DetalleObra.css";

function DetalleObra() {
  const { tipo, id } = useParams();
  const [obra, setObra] = useState(null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const usuario = jwtDecode(storedToken);
        console.log("Usuario autenticado decodificado:", usuario);
        setUsuarioAutenticado(usuario);
      } catch (error) {
        Swal.fire({
          title: "Sesión no válida",
          text: "Tu sesión no es válida o ha expirado. Por favor, inicia sesión nuevamente.",
          icon: "error",
          confirmButtonText: "Iniciar sesión",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/inicio-sesion"; 
          }
        });
        setUsuarioAutenticado(null);
      }
    }
  }, []);

  useEffect(() => {
    const obtenerObra = async () => {
      try {
        let endpoint;
        switch (tipo) {
          case "pelicula":
            endpoint = `http://localhost:5000/api/peliculas`;
            break;
          case "serie":
            endpoint = `http://localhost:5000/api/series`;
            break;
          case "libro":
            endpoint = `http://localhost:5000/api/libros`;
            break;
          default:
            throw new Error("Tipo de obra no válido");
        }

        const response = await axios.get(endpoint);
        const data = response.data;
        const obraEncontrada = data.find((item) => item._id === id);

        if (obraEncontrada) {
          const valoraciones = obraEncontrada.resenias.map((r) => r.valoracion);
          const promedioValoracion =
            valoraciones.length > 0
              ? (
                  valoraciones.reduce((sum, val) => sum + val, 0) /
                  valoraciones.length
                ).toFixed(1)
              : 0;

          setObra({ ...obraEncontrada, promedio_valoracion: promedioValoracion });
        } else {
          Swal.fire({
            title: "Obra no encontrada",
            text: "La obra que buscas no existe o ha sido eliminada.",
            icon: "warning",
            confirmButtonText: "Aceptar",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error de conexión",
          text: "No se pudieron cargar los detalles de la obra. Verifica tu conexión a internet e inténtalo nuevamente.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    };

    obtenerObra();
  }, [tipo, id]);

  const agregarResenaLocalmente = (nuevaResena) => {
    setObra((prevObra) => ({
      ...prevObra,
      resenias: [...prevObra.resenias, nuevaResena],
    }));
  };
  

  if (!obra) return <p>Cargando...</p>;

  return (
    <div className="detalle-obra-contenedor">
      <div className="detalle-obra">
        <div className="detalle-obra-header">
          <img
            src={`http://localhost:5000/imagenes/${obra.imagen}.jpg`}
            alt={obra.titulo}
            className="obra-imagen"
          />
          <div className="detalle-obra-info">
            <h1>{obra.titulo}</h1>
            <p>Director/Autor: {obra.director || obra.creador || obra.autor}</p>
            <p>Productora: {obra.productora}</p>
            <p>Fecha de estreno: {new Date(obra.fecha_lanzamiento).toLocaleDateString()}</p>
            <p className="sinopsis">Sinopsis: {obra.sinopsis}</p>
            <div className="calificacion">
              <Estrellas calificacion={obra.promedio_valoracion || 0} interactiva={false} />
              <p>{obra.promedio_valoracion ? `${obra.promedio_valoracion} / 5` : "No hay valoraciones aún"}</p>
            </div>
            <button className="boton-lista">+ Agregar a lista de pendientes</button>
          </div>
        </div>
        <Resenias
          resenias={obra.resenias}
          tipo={tipo}
          idRelacionado={obra._id}
          usuarioAutenticado={usuarioAutenticado}
          agregarResenaLocalmente={agregarResenaLocalmente}
        />
      </div>
    </div>
  );
}
export default DetalleObra;
