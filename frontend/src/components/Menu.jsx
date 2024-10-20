import React from 'react';
import {Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Menu.css';
import Buscador from './Buscador';

function MenuComponent() {
  return (
    <Navbar expand="lg" className="custom-navbar mb-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="litflix-title text-[#4cc9f0]">Litflix</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Collapse id="offcanvasNavbar">
          
          <Nav className="filtro">
            <Link className="nav-link" to="/peliculas">Películas</Link>
            <Link className="nav-link" to="/series">Series</Link>
            <Link className="nav-link" to="/libros">Libros</Link>
          </Nav>

          <Buscador/> 
                   
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/registro" className="text-white">
              <img 
                src="../iconos/usuario.png" 
                alt="Usuario" 
                style={{ width: '3rem', height: '3rem' }} 
              />
            </Nav.Link>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MenuComponent;
