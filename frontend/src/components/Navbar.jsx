import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../styles/navbar.css';


function NavbarComponent() {
  return (
   <Navbar expand="lg" className="custom-navbar mb-3"> {/* Clase personalizada */}

      <Container fluid>
        <Navbar.Brand href="#">Litflix</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Menú</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="/">Inicio</Nav.Link>
              <Nav.Link href="/sobre-nosotros">Sobre Nosotros</Nav.Link>
              <Nav.Link href="/contacto">Contacto</Nav.Link>
              <NavDropdown title="Categorías" id="offcanvasNavbarDropdown">
                <NavDropdown.Item href="#accion1">Acción</NavDropdown.Item>
                <NavDropdown.Item href="#accion2">Comedia</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#accion3">Drama</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Buscar"
                className="me-2"
                aria-label="Buscar"
              />
              <Button variant="outline-success">Buscar</Button>
            </Form>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
