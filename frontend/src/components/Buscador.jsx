import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import '../styles/Buscador.css';

function Buscador({ onSearch }) {
  const [busqueda, setBusqueda] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const getPlaceholder = () => {
    switch (location.pathname) {
      case '/libros':
        return 'Buscar libro';
      case '/peliculas':
        return 'Buscar película';
      case '/series':
        return 'Buscar serie';
      default:
        return 'Buscar libro, serie o película';
    }
  };

  const handleInputChange = (event) => {
    setBusqueda(event.target.value);
  };
  const handleSearch = async (event) => {
    event.preventDefault();
    if (busqueda.trim() === '') return;
  
    let urlBusqueda = `http://localhost:5000/api/buscar?q=${busqueda}`;
    if (location.pathname === '/libros') {
      urlBusqueda = `http://localhost:5000/api/buscar-libros?q=${busqueda}`;
    } else if (location.pathname === '/peliculas') {
      urlBusqueda = `http://localhost:5000/api/buscar-peliculas?q=${busqueda}`;
    } else if (location.pathname === '/series') {
      urlBusqueda = `http://localhost:5000/api/buscar-series?q=${busqueda}`;
    }
  
    try {
      const res = await axios.get(urlBusqueda);
  
      // Si estamos en la página de inicio, redirigir a los resultados
      if (location.pathname === '/') {
        navigate(`/resultados`, { state: { resultados: res.data, termino: busqueda } });
      } else {
        onSearch(res.data, busqueda); // Pasar los resultados a la página actual
      }
      setBusqueda(''); // Limpiar la búsqueda después de enviarla
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    }
  };
  

  return (
    <Form className="search-form d-flex" onSubmit={handleSearch}>
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <Form.Control
          type="search"
          placeholder={getPlaceholder()}
          className="search-input"
          aria-label="Buscar"
          value={busqueda}
          onChange={handleInputChange}
        />
      </div>
    </Form>
  );
}

export default Buscador;
