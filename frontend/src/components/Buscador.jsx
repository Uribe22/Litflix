import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Buscador.css';

function Buscador() {
  const [busqueda, setBusqueda] = useState('');
  const location = useLocation(); // Hook para obtener la ubicación actual
  const navigate = useNavigate(); // Hook para navegar a la página de resultados

  // Función para determinar el placeholder según la ruta actual
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
    setBusqueda(event.target.value); // Actualiza el estado con el valor del input
  };

  const handleSearch = async (event) => {
    event.preventDefault(); // Evita que la página se recargue
    if (busqueda.trim() === '') return; // Evita la búsqueda si el campo está vacío

    // Determinar la URL de búsqueda según la ruta actual
    let urlBusqueda = `http://localhost:3001/api/buscar?q=${busqueda}`;

    if (location.pathname === '/libros') {
      urlBusqueda = `http://localhost:3001/api/buscar-libros?q=${busqueda}`;
    } else if (location.pathname === '/peliculas') {
      urlBusqueda = `http://localhost:3001/api/buscar-peliculas?q=${busqueda}`;
    } else if (location.pathname === '/series') {
      urlBusqueda = `http://localhost:3001/api/buscar-series?q=${busqueda}`;
    }

    try {
      const res = await axios.get(urlBusqueda);
      console.log('Resultados de la búsqueda:', res.data);

      // Redirigir a la página de resultados de búsqueda con los datos
      navigate(`/resultados?q=${busqueda}`, { state: { resultados: res.data, termino: busqueda } });

      // Limpiar el campo de búsqueda
      setBusqueda('');
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    }
  };

  return (
    <Form className="search-form d-flex" onSubmit={handleSearch}>
      <Form.Control
        type="search"
        placeholder={getPlaceholder()} // Cambiar placeholder según la ruta
        className="search-input me-2"
        aria-label="Buscar"
        value={busqueda} // Conectar el valor del input con el estado
        onChange={handleInputChange} // Actualizar el valor al escribir
      />
      <Button type="submit" className="search-button">Buscar</Button>
    </Form>
  );
}

export default Buscador;
