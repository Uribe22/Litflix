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
  const [mostrarTextoCompleto, setMostrarTextoCompleto] = useState(false);

  const toggleTextoCompleto = () => {
    setMostrarTextoCompleto(!mostrarTextoCompleto);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const usuario = jwtDecode(storedToken);
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
          const valoraciones = obraEncontrada.resenias
            .map((r) => r.valoracion)
            .filter((val) => typeof val === 'number' && !isNaN(val));
          const promedioValoracion = valoraciones.length > 0 
            ? parseFloat((valoraciones.reduce((sum, val) => sum + val, 0) / valoraciones.length).toFixed(1)) 
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

  const agregarPendiente = async () => {
    if (!usuarioAutenticado) {
      Swal.fire({
        title: "No has iniciado sesión",
        text: "Por favor, inicia sesión para agregar esta obra a tu lista de pendientes.",
        icon: "warning",
        confirmButtonText: "Iniciar sesión",
      });
      return;
    }

    try {
      const storedToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };

      const response = await axios.post(
        `http://localhost:5000/api/agregar-pendiente`,
        { id_pelicula: obra._id, tipo: tipo },
        config
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Obra agregada",
          text: "La obra ha sido añadida a tu lista de pendientes.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al agregar la obra a tu lista de pendientes.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
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
            <p>Fecha de estreno: {new Date(obra.fecha_lanzamiento).toLocaleDateString()}</p>
            <div className="sinopsis">
  <p>
    {mostrarTextoCompleto
      ? obra.sinopsis
      : `${obra.sinopsis.substring(0, 150)}...`}
  </p>
  {obra.sinopsis.length > 150 && (
    <button className="boton-leer-mas" onClick={toggleTextoCompleto}>
      {mostrarTextoCompleto ? "Leer menos" : "Leer más"}
    </button>
  )}
</div>

            <div className="calificacion">
              <Estrellas calificacion={obra.promedio_valoracion} interactiva={false} />
              <p>{obra.promedio_valoracion ? `${obra.promedio_valoracion} / 5` : "No hay valoraciones aún"}</p>
            </div>
            <button className="boton-lista" onClick={agregarPendiente}>
              + Agregar a lista de pendientes
            </button>
          </div>
        </div>
        <Resenias resenias={obra.resenias} tipo={tipo} idRelacionado={obra._id} usuarioAutenticado={usuarioAutenticado} />
      </div>
    </div>
  );
}

export default DetalleObra;
