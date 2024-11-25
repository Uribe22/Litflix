import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/Pendientes.css';

const Pendientes = () => {
  const [artworks, setArtworks] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/150',
      name: 'Obra1',
      rating: 4.5,
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/150',
      name: 'Obra2',
      rating: 4,
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/150',
      name: 'Obra3',
      rating: 4.5,
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/150',
      name: 'Obra4',
      rating: 5,
    },
  ]);

  const removeArtwork = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      setArtworks(artworks.filter((artwork) => artwork.id !== id));
      Swal.fire('¡Eliminado!', 'La obra ha sido eliminada.', 'success');
    }
  };

  const viewDetails = (id) => {
    Swal.fire({
      title: 'Detalles de la obra',
      text: `Estás viendo los detalles de la obra con ID: ${id}`,
      icon: 'info',
      confirmButtonText: 'Cerrar',
    });
  };

  return (
    <div className="pendientes-container">
      <h1>Lista de Pendientes</h1>
      <div className="pendientes-grid">
        {artworks.map((artwork) => (
          <div className="pendientes-card" key={artwork.id}>
            <img className="pendientes-image" src={artwork.image} alt={artwork.name} />
            <h2 className="pendientes-title">{artwork.name}</h2>
            <p className="pendientes-rating">Valoración: {artwork.rating}⭐</p>
            <div className="pendientes-actions">
              <button className="btn btn-details" onClick={() => viewDetails(artwork.id)}>
                Ver Detalles
              </button>
              <button className="btn btn-remove" onClick={() => removeArtwork(artwork.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pendientes;