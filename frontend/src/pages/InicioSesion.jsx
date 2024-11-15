import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Autenticacion.css";

const Register = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasenia: ""
  });

  const [error, setError] = useState("");
  const [MostrarContrasenia, setMostrarContrasenia] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Usuario inició sesión:", formData);
    setError("");
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
        {error && <p className="error-autenticacion">{error}</p>}
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

export default Register;
