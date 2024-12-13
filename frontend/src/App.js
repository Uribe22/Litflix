import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/General.css";

import Menu from "./components/Menu";
import Resultados from "./pages/Resultados";

import Inicio from "./pages/Inicio";
import Registro from "./pages/Registro";
import InicioSesion from "./pages/InicioSesion";
import Peliculas from "./pages/Peliculas";
import Series from "./pages/Series";
import Libros from "./pages/Libros";
import DetalleObra from "./pages/DetalleObra";
import Pendientes from "./pages/Pendientes";
import AjustesCuenta from "./pages/AjustesCuenta";

function AppContent() {
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const manejarBusqueda = (resultados, termino) => {
    setResultadosBusqueda(resultados);
    setTerminoBusqueda(termino);
  };

  const limpiarBusqueda = () => {
    setResultadosBusqueda([]);
    setTerminoBusqueda("");
  };

  return (
    <>
      <Menu onSearch={manejarBusqueda} />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route
          path="/peliculas"
          element={
            <Peliculas
              resultadosBusqueda={resultadosBusqueda}
              terminoBusqueda={terminoBusqueda}
              onSearch={manejarBusqueda}
            />
          }
        />
        <Route
          path="/series"
          element={
            <Series
              resultadosBusqueda={resultadosBusqueda}
              terminoBusqueda={terminoBusqueda}
              onSearch={manejarBusqueda}
            />
          }
        />
        <Route
          path="/libros"
          element={
            <Libros
              resultadosBusqueda={resultadosBusqueda}
              terminoBusqueda={terminoBusqueda}
              onSearch={manejarBusqueda}
            />
          }
        />
        <Route
          path="/resultados"
          element={
            <Resultados
              resultados={resultadosBusqueda}
              termino={terminoBusqueda}
              onClearSearch={limpiarBusqueda}
            />
          }
        />
        <Route path="/detalleobra/:tipo/:id" element={<DetalleObra />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio-sesion" element={<InicioSesion />} />
        <Route path="/lista-pendientes" element={<Pendientes />} />
        <Route path="/ajustes-cuenta" element={<AjustesCuenta />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
