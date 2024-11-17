import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom'; // Importar useLocation
import '../styles/Menu.css';
import Buscador from './Buscador';

function MenuComponent() {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const location = useLocation();  // Usar useLocation para detectar cambios en la ruta

  // Verifica el estado de la sesión cada vez que cambie la ruta
  useEffect(() => {
    const sesionUsuario = localStorage.getItem("token") !== null;
    setSesionIniciada(sesionUsuario);
  }, [location]);  // El hook se ejecutará cada vez que cambie la ubicación

  // Maneja el cierre de sesión
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setSesionIniciada(false);  // Actualiza el estado de la sesión

    alert("Se ha cerrado tu sesión");
  };

  return (
    <Navbar expand="lg" className="custom-navbar mb-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="litflix-title">Litflix</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Collapse id="offcanvasNavbar">
          
          <Nav className="filtro">
            <Link className="nav-link" to="/peliculas">Películas</Link>
            <Link className="nav-link" to="/series">Series</Link>
            <Link className="nav-link" to="/libros">Libros</Link>
          </Nav>

          <Buscador/>
                   
          <Nav className="ml-auto">
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="text-white">
                <img 
                  src="../iconos/usuario.png" 
                  alt="Usuario" 
                  style={{ width: '3rem', height: '3rem' }} 
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {sesionIniciada ? (
                  <>
                    <Dropdown.Item as={Link} to="/">Lista de Pendientes</Dropdown.Item>
                    <Dropdown.Item onClick={cerrarSesion}>Cerrar sesión</Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item as={Link} to="/inicio-sesion">Iniciar sesión</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/registro">Registrarse</Dropdown.Item>
                  </>
                )}
                
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MenuComponent;
