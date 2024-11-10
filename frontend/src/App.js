import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Resultados from './pages/Resultados';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Peliculas from './pages/Peliculas';  
import Series from './pages/Series';  
import Libros from './pages/Libros';  
import DetalleObra from './pages/DetalleObra';
import './styles/General.css';
import Inicio from './pages/Inicio';
import './styles/General.css';  
import Registro from './pages/Registro';
import InicioSesion from './pages/InicioSesion'

function App() {
  return (
    <Router>
      <div>
        <Menu />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/peliculas" element={<Peliculas />} />
          <Route path="/series" element={<Series />} />
          <Route path="/libros" element={<Libros />} />
          <Route path="/detalleobra/:tipo/:id" element={<DetalleObra />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/inicio-sesion" element={<InicioSesion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
