import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../styles/Pendientes.css';

const Pendientes = () => {
  const [listaPendientes, setListaPendientes] = useState([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/pendientes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener pendientes: ${response.statusText}`);
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

  useEffect(() => {
    fetchPendientes();
  }, []);

  if (estaCargando) {
    return <p>Cargando pendientes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="pendientes-container">
      <h1>Lista de Pendientes</h1>
      {listaPendientes.length === 0 ? (
        <p>No hay pendientes por mostrar.</p>
      ) : (
        <div className="pendientes-grid">
          {listaPendientes.map((pendiente, index) => (
            <div className="pendientes-card" key={index}>
              <img className='pendientes-image' src='http://localhost:5000/imagenes/Shrek.jpg'></img>
              <h2 className="pendientes-title">{pendiente.titulo}</h2>
              <p className="pendientes-rating">Expectativa: {pendiente.espectativa || "N/A"}⭐</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pendientes;
