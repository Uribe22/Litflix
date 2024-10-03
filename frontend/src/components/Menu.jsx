import React, { useState } from 'react';
import { Button, Container, Nav, Navbar, Form } from 'react-bootstrap';
import { Search } from 'lucide-react'; // Importa los iconos de lucide-react
import { Link } from 'react-router-dom'; // Usamos react-router-dom para las rutas

function MenuComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar expand="lg" className="custom-navbar mb-3">
      <Container fluid>
        {/* Utiliza Link para la navegación interna */}
        <Navbar.Brand as={Link} to="/" className="litflix-title text-[#4cc9f0]">Litflix</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        <Navbar.Collapse id="offcanvasNavbar" className={`${isMenuOpen ? 'show' : ''}`}>
        <Nav className="justify-content-end flex-grow-1 pe-3">
        <Link className="nav-link" to="/libros">Libros</Link>
        <Link className="nav-link" to="/peliculas">Películas</Link>
        <Link className="nav-link" to="/series">Series</Link>
        </Nav>

          {/* Sección de búsqueda */}
          <Form className="search-form d-flex">
            <Form.Control
              type="search"
              placeholder="Buscar"
              className="search-input me-2"
              aria-label="Buscar"
            />
            <Button className="search-button">Buscar</Button>
          </Form>

          {/* User section */}
          <Nav className="ml-auto">
            <Nav.Link href="/login" className="text-white">
              <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i> Iniciar Sesión
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MenuComponent;
