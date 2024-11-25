import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Menu.css';
import Buscador from './Buscador';
import Swal from 'sweetalert2';

function MenuComponent() {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const sesionUsuario = localStorage.getItem("token") !== null;
    setSesionIniciada(sesionUsuario);
  }, [location]);

  const confirmarCerrarSesion = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás a punto de cerrar tu sesión actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      cerrarSesion();
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setSesionIniciada(false);

    Swal.fire('Se ha cerrado tu sesión correctamente');
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
                    <Dropdown.Item as={Link} to="/lista-pendientes">Lista de Pendientes</Dropdown.Item>
                    <Dropdown.Item onClick={confirmarCerrarSesion}>Cerrar sesión</Dropdown.Item>
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
