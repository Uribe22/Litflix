import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/Autenticacion.css";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo: "",
    contrasenia: "",
    confirmar_contrasenia: ""
  });

  const [error, setError] = useState("");
  const [MostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [MostrarConfirmarContrasenia, setMostrarConfirmarContrasenia] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.contrasenia !== formData.confirmar_contrasenia) {
      setError("Las contraseñas no coinciden");
      return;
    }
    console.log("Usuario registrado:", formData);
    setError("");
  };

  return (
    <div className="contenedor">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <div className="campo-texto">
          <input
            type="text"
            id="nombre_usuario"
            name="nombre_usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            required
            placeholder="Nombre de usuario"
          />
        </div>
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
        <div className="campo-texto contrasenia">
          <input
            type={MostrarConfirmarContrasenia ? "text" : "password"}
            id="confirmar_contrasenia"
            name="confirmar_contrasenia"
            value={formData.confirmar_contrasenia}
            onChange={handleChange}
            required
            placeholder="Confirmar contraseña"
          />
          <button
            type="button"
            className="mostrar-contrasenia"
            onClick={() => setMostrarConfirmarContrasenia(!MostrarConfirmarContrasenia)}
          >
            {MostrarConfirmarContrasenia ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <p className="mensaje-error">{error}</p>}
        <button type="submit" className="registrar">
          Registrarse
        </button>
      </form>

      <div className="iniciar-sesion">
        <p>¿Ya tienes una cuenta? <Link to="/inicio-sesion">Inicia sesión aquí</Link></p>
      </div>
    </div>
  );
};

export default Register;
