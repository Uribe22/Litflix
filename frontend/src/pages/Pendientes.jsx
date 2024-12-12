import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Pendientes.css';

const Pendientes = () => {
  const [listaPendientes, setListaPendientes] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire({
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            icon: 'warning',
            confirmButtonText: 'Iniciar sesión',
          }).then(() => {
            navigate("/inicio-sesion");
          });
          return;
        }

        const response = await fetch('http://localhost:5000/api/pendientes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            Swal.fire({
              title: 'Sesión expirada',
              text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
              icon: 'warning',
              confirmButtonText: 'Iniciar sesión',
            }).then(() => {
              localStorage.removeItem('token');
              navigate("/inicio-sesion");
            });
          } else {
            throw new Error(`Error al obtener pendientes: ${response.statusText}`);
          }
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setListaPendientes(data);
        } else {
          setListaPendientes([]);
        }
        setEstaCargando(false);
      } catch (err) {
        setError(err.message);
        setEstaCargando(false);
      }
    };

    fetchPendientes();
  }, [navigate]);

  if (estaCargando) {
    return <p>Cargando pendientes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const Redireccionar = (id, tipo) => {
    navigate(`/detalleobra/${tipo}/${id}`);
  };

  return (
    <div className="pendientes-container">
      <h1>Lista de Pendientes</h1>
      {listaPendientes.length === 0 ? (
        <p>No hay pendientes por mostrar.</p>
      ) : (
        <div className="pendientes-grid">
          {listaPendientes.map((pendiente, index) => (
            <div className="pendientes-tarjeta" key={index} onClick={() => Redireccionar(pendiente.id, pendiente.tipo)}>
              <img className='pendientes-imagen' src={`http://localhost:5000/imagenes/${pendiente.imagen}.jpg`} alt={pendiente.titulo} />
              <h2 className="pendientes-titulo">{pendiente.titulo}</h2>
              <p className="pendientes-expectativa">Expectativa: {pendiente.espectativa || "N/A"}⭐</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pendientes;
