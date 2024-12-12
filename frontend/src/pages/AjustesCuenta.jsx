import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/AjustesCuenta.css';

const AjustesCuenta = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updateName, setUpdateName] = useState(false);
    const [updateEmail, setUpdateEmail] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
      event.preventDefault();

      if (!updateName && !updateEmail && !updatePassword) {
        Swal.fire({
          title: 'No se ha seleccionado ningún cambio',
          text: '¿Seguro que deseas salir sin realizar ningún cambio?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Salir',
        }).then((result) => {
          if (result.isConfirmed) {
            return;
          } else {
            navigate('/');
          }
        });
        return;
      }

      if (updatePassword) {
        if (password.length < 8) {
          setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Las contraseñas no coinciden.');
          return;
        }
      }

      const updatedData = {};
      if (updateName) updatedData.name = name;
      if (updateEmail) updatedData.email = email;
      if (updatePassword) updatedData.password = password;

      console.log('Datos actualizados:', updatedData);
      setErrorMessage('');

      navigate('/');
    };

    const handleCheckboxChange = (field, checked) => {
      if (!checked) {
        if (field === 'name') setName('');
        if (field === 'email') setEmail('');
        if (field === 'password') {
          setPassword('');
          setConfirmPassword('');
        }
      }
    };

    const handleDeleteAccount = () => {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará permanentemente tu cuenta. Este proceso es irreversible. ¿Quieres continuar?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('Usuario eliminado');
            navigate('/');
          } else {
            console.log('Eliminación cancelada');
          }
        });
    };

    return (
      <div className="edit-profile">
        <h2>Ajustes de cuenta</h2>

        {errorMessage && (
          <div className="warning-message">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <div className="input-container">
              <input
                type="checkbox"
                id="updateName"
                checked={updateName}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUpdateName(checked);
                  handleCheckboxChange('name', checked);
                }}
              />
              <label htmlFor="updateName">Actualizar Nombre</label>
            </div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!updateName}
              required={updateName}
            />
          </div>
          <div className="field">
            <div className="input-container">
              <input
                type="checkbox"
                id="updateEmail"
                checked={updateEmail}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUpdateEmail(checked);
                  handleCheckboxChange('email', checked);
                }}
              />
              <label htmlFor="updateEmail">Actualizar Correo</label>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!updateEmail}
              required={updateEmail}
            />
          </div>
          <div className="field">
            <div className="input-container">
              <input
                type="checkbox"
                id="updatePassword"
                checked={updatePassword}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setUpdatePassword(checked);
                  handleCheckboxChange('password', checked);
                }}
              />
              <label htmlFor="updatePassword">Actualizar Contraseña</label>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!updatePassword}
              required={updatePassword}
            />
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!updatePassword}
              required={updatePassword}
            />
          </div>
          <button type="submit">Actualizar datos</button>
        </form>

        <button className="delete-account-button" onClick={handleDeleteAccount}>
          Eliminar cuenta
        </button>
      </div>
    );
};

export default AjustesCuenta;
