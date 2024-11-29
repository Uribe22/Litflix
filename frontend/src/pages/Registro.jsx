import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Autenticacion.css";
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    correo: "",
    contrasenia: "",
    confirmar_contrasenia: ""
  });

  const [MostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [MostrarConfirmarContrasenia, setMostrarConfirmarContrasenia] = useState(false);
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
    if (formData.contrasenia.length < 8) {
      Swal.fire({
        title: 'Error de registro',
        text: 'Las contraseñas deben tener al menos 8 caracteres',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
    else if (formData.contrasenia !== formData.confirmar_contrasenia) {
      Swal.fire({
        title: 'Error de registro',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
    
    try {
      const verificacion = await axios.post('http://localhost:5000/api/verificar-usuario', {
        nombre: formData.nombre_usuario,
        correo: formData.correo
      });

      if (verificacion.status === 200) {
        const registro = await axios.post('http://localhost:5000/api/registrar', {
          nombre: formData.nombre_usuario,
          correo: formData.correo,
          contrasenia: formData.contrasenia
        });

        const { token, nombre } = registro.data;
        localStorage.setItem('token', token);

        Swal.fire({
          title: 'Cuenta creada exitósamente',
          text: `¡Bienvenido a Litflix! ${nombre}`,
          icon: 'success',
          confirmButtonText: 'Genial'
        });

        navigate('/');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error de inicio de sesión',
        text: error.response?.data?.message || 'Error al iniciar sesión',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });

      console.error('Error al registrar usuario:', error);
    }
  };

  return (
    <div className="contenedor-autenticacion">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="formulario-autenticacion">
        <div className="campo-texto-autenticacion">
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
        <div className="campo-texto-autenticacion contrasenia">
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
        <button type="submit" className="boton-autenticacion">
          Registrarse
        </button>
      </form>

      <div className="link-autenticacion">
        <p>¿Ya tienes una cuenta? <Link to="/inicio-sesion">Inicia sesión aquí</Link></p>
      </div>
    </div>
  );
};

export default Register;
