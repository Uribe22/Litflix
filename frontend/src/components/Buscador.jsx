import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Buscador.css';
import { FaSearch } from 'react-icons/fa';

function Buscador() {
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

    console.log('URL de búsqueda:', urlBusqueda); // Depuración

    try {
      const res = await axios.get(urlBusqueda);
      console.log('Resultados de la búsqueda:', res.data); // Depuración
      navigate(`/resultados?q=${busqueda}`, { state: { resultados: res.data, termino: busqueda } });
      setBusqueda('');
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
      {/* Agregar un botón de envío oculto */}
      <button type="submit" style={{ display: 'none' }}></button>
    </Form>
  );
}

export default Buscador;
