import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/Autenticacion.css";

const InicioSesion = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasenia: ""
  });

  const [error, setError] = useState("");
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
    setError("");

    try {
      const response = await axios.post('http://localhost:5000/api/iniciar-sesion', {
        correo: formData.correo,
        contrasenia: formData.contrasenia
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      alert("Sesión iniciada correctamente");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      console.error("Error de inicio de sesión:", error);
    }
  };

  return (
    <div className="contenedor">
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <div className="campo-texto">
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
        <div className="campo-texto contrasenia">
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
        {error && <p className="mensaje-error">{error}</p>}
        <button type="submit" className="registrar">
          Entrar
        </button>
      </form>

      <div className="iniciar-sesion">
        <p>¿No tienes una cuenta? <Link to="/registro">Crea una aquí</Link></p>
      </div>
    </div>
  );
};

export default InicioSesion;
