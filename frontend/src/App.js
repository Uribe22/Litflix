import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu'; 
import Inicio from './pages/Inicio';  
import Nosotros from './pages/Nosotros';  
import './styles/General.css'; 


function App() {
  return (
    <Router>
      <div>
        {/* Aquí incluimos la barra de navegación */}
        <Menu />  {/* Cambié 'NavbarComponent' por 'Menu' */}
        <Routes>
          {/* Definir las rutas de las diferentes páginas */}
          <Route path="/" element={<Inicio />} />  {/* Cambié 'Home' por 'Inicio' */}
          <Route path="/sobre-nosotros" element={<Nosotros />} />  {/* Cambié 'About' por 'Nosotros' */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
