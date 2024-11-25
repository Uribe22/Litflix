import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/Autenticacion.css";
import Swal from 'sweetalert2';

const InicioSesion = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasenia: ""
  });

  const [MostrarContrasenia, setMostrarContrasenia] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/iniciar-sesion', {
        correo: formData.correo,
        contrasenia: formData.contrasenia
      });

      const { token, nombre } = response.data;
      localStorage.setItem("token", token);

      Swal.fire({
        title: 'Sesión iniciada correctamente',
        text: `Bienvenido de vuelta ${nombre}`,
        icon: 'success',
        confirmButtonText: 'Genial'
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        title: 'Error de inicio de sesión',
        text: error.response?.data?.message || 'Error al iniciar sesión',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });

      console.error("Error de inicio de sesión:", error);
    }
  };

  return (
    <div className="contenedor-autenticacion">
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleSubmit} className="formulario-autenticacion">
        <div className="campo-texto-autenticacion">
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            placeholder="Correo electrónico"
          />
        </div>
        <div className="campo-texto-autenticacion contrasenia">
          <input
            type={MostrarContrasenia ? "text" : "password"}
            id="contrasenia"
            name="contrasenia"
            value={formData.contrasenia}
            onChange={handleChange}
            required
            placeholder="Contraseña"
          />
          <button
            type="button"
            className="mostrar-contrasenia"
            onClick={() => setMostrarContrasenia(!MostrarContrasenia)}
          >
            {MostrarContrasenia ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button type="submit" className="boton-autenticacion">
          Entrar
        </button>
      </form>

      <div className="link-autenticacion">
        <p>¿No tienes una cuenta? <Link to="/registro">Crea una aquí</Link></p>
      </div>
    </div>
  );
};

export default InicioSesion;
