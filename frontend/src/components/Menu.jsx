import React from 'react';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Menu.css';
import Buscador from './Buscador';

function MenuComponent() {
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
                <Dropdown.Item as={Link} to="/registro">Registrarse</Dropdown.Item>
                <Dropdown.Item as={Link} to="/inicio-sesion">Iniciar sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MenuComponent;
