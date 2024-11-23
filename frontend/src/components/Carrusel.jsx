import React, { useState } from 'react';
import '../styles/Carrusel.css';

export default function Carrusel({ items, renderItem }) {
  const itemsPerPage = 3; // Número de tarjetas por sección
  const totalPages = Math.ceil(items.length / itemsPerPage); // Total de páginas
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calcular los elementos visibles según la página actual
  const startIndex = currentPage * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="carrusel-container">
      <button 
        className="carrusel-button prev" 
        onClick={handlePrev} 
        disabled={currentPage === 0}
      >
        &#8249;
      </button>
      <div className="carrusel">
        {visibleItems.map((item, index) => (
          <div key={index} className="carrusel-item">
            {renderItem(item)}
          </div>
        ))}
      </div>
      <button
        className="carrusel-button next"
        onClick={handleNext}
        disabled={currentPage === totalPages - 1}
      >
        &#8250;
      </button>
    </div>
  );
}
