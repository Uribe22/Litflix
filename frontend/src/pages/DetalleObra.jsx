import React, { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
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
  const [pendientes, setPendientes] = useState([]);
  const navigate = useNavigate();

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
            localStorage.removeItem('token');
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

  useEffect(() => {
    const obtenerPendientes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pendientes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPendientes(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de pendientes:", error);
      }
    };

    if (usuarioAutenticado) {
      obtenerPendientes();
    }
  }, [usuarioAutenticado]);

  const estaEnPendientes = pendientes.some((pendiente) => String(pendiente.id) === String(obra?._id));

  const manejarAgregarPendiente = () => {
    if (estaEnPendientes) {
      navigate("/lista-pendientes");
    } else {
      Swal.fire({
        title: "Agregar a lista de pendientes",
        text: "¿Estás seguro de que deseas agregar esta obra a tu lista de pendientes?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await agregarPendiente();
            setPendientes((prevPendientes) => [...prevPendientes, obra]);
          } catch (error) {
            console.error(error);
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al agregar la obra a tu lista de pendientes.",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          }
        }
      });
    }
  };

  const agregarPendiente = async () => {
    if (!usuarioAutenticado) {
      Swal.fire({
        title: "No has iniciado sesión",
        text: "Por favor, inicia sesión para agregar esta obra a tu lista de pendientes.",
        icon: "warning",
        confirmButtonText: "Iniciar sesión",
      }).then(() => {
        localStorage.removeItem('token');
        navigate("/inicio-sesion");
      });
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const usuario = jwtDecode(token);
      const id_usuario = usuario.usuarioId;
  
      await axios.post(
        "http://localhost:5000/api/pendientes/agregar",
        {
          id_usuario,
          obra: {
            id: obra._id,
            titulo: obra.titulo,
            tipo: obra.tipo,
            fecha: new Date(),
            imagen: obra.imagen,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
  
      Swal.fire({
        title: "Obra agregada",
        text: "La obra ha sido agregada a tu lista de pendientes.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
  
      setPendientes((prevPendientes) => [...prevPendientes, { id: obra._id }]);
    } catch (error) {
      console.error("Detalles del error:", error);
  
      if (error.response) {
        const { status, data } = error.response;
  
        if (status === 401) {
          Swal.fire({
            title: "Sesión expirada",
            text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            icon: "warning",
            confirmButtonText: "Iniciar sesión",
          }).then(() => {
            localStorage.removeItem('token');
            navigate("/inicio-sesion");
          });
        } else {
          Swal.fire({
            title: "Error",
            text: data.message || "Hubo un problema al agregar la obra a la lista de pendientes.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo conectar con el servidor. Por favor, inténtalo más tarde.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };  

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
              <p>{obra.promedio_valoracion ? `${obra.promedio_valoracion}` : "No hay valoraciones aún"}</p>
            </div>
            <button className="boton-lista" onClick={manejarAgregarPendiente}>
              {estaEnPendientes ? "Ver en lista de pendientes" : "+ Agregar a lista de pendientes"}
            </button>
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