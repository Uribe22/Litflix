import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import Peliculas from './pages/Peliculas';  
import Series from './pages/Series';  
import Libros from './pages/Libros';  
import Inicio from './pages/Inicio';  
import './styles/General.css';

function App() {
  return (
    <Router>
      <div>
        {/* Barra de navegación */}
        <Menu />
        <Routes>
          {/* Definir las rutas de las diferentes páginas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/peliculas" element={<Peliculas />} />
          <Route path="/series" element={<Series />} />
          <Route path="/libros" element={<Libros />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
