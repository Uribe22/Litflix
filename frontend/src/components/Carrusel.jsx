// Carrusel.jsx
import React from 'react';
import '../styles/Carrusel.css';

export default function Carrusel({ items, renderItem }) {
  return (
    <div className="carrusel">
      {items.map((item, index) => (
        <div key={index} className="carrusel-item">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
