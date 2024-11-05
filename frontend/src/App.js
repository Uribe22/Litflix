import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Resultados from './pages/Resultados';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Peliculas from './pages/Peliculas';  
import Series from './pages/Series';  
import Libros from './pages/Libros';  
/*import Inicio from './pages/Inicio';  
import Registro from './pages/Registro';*/

import './styles/General.css';

function App() {
  return (
    <Router>
      <div>
        <Menu />
        <Routes>
          {/*<Route path="/" element={<Inicio />} />*/}
          <Route path="/peliculas" element={<Peliculas />} />
          <Route path="/series" element={<Series />} />
          <Route path="/libros" element={<Libros />} />
          <Route path="/resultados" element={<Resultados />} />
          {/*<Route path="/registro" element={<Registro />} />*/}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
