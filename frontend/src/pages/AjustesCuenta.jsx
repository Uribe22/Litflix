import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios'; // Importa axios
import '../styles/AjustesCuenta.css';

const AjustesCuenta = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState(''); // Contraseña actual
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedField, setSelectedField] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Token de acceso (deberías obtenerlo de tu sistema de autenticación)
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en localStorage

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedField) {
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

        if (selectedField === 'password') {
            if (!currentPassword) {
                setErrorMessage('Debes ingresar tu contraseña actual para cambiar la contraseña.');
                return;
            }
            if (password.length < 8) {
                setErrorMessage('La nueva contraseña debe tener al menos 8 caracteres.');
                return;
            }
            if (password !== confirmPassword) {
                setErrorMessage('Las nuevas contraseñas no coinciden.');
                return;
            }
        }

        try {
            let response;
            if (selectedField === 'name') {
                // Consulta para cambiar el nombre
                response = await axios.post('http://localhost:5000/api/ajustes-cuenta/cambiar-nombre', { name }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else if (selectedField === 'email') {
                // Consulta para cambiar el correo
                response = await axios.post('http://localhost:5000/api/ajustes-cuenta/cambiar-correo', { email }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else if (selectedField === 'password') {
                // Consulta para cambiar la contraseña
                response = await axios.post('http://localhost:5000/api/ajustes-cuenta/cambiar-contrasena', {
                    currentPassword, // Contraseña actual
                    newPassword: password, // Nueva contraseña
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            // Manejo de la respuesta
            if (response.status === 200) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Los datos se actualizaron correctamente.',
                    icon: 'success',
                });
                navigate('/');
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar los datos.',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.error('Error al actualizar los datos:', error);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Hubo un problema al conectarse al servidor.',
                icon: 'error',
            });
        }
    };

    const handleCheckboxChange = (field) => {
        if (selectedField === field) {
            setSelectedField(null);
            if (field === 'name') setName('');
            if (field === 'email') setEmail('');
            if (field === 'password') {
                setCurrentPassword('');
                setPassword('');
                setConfirmPassword('');
            }
        } else {
            setSelectedField(field);
        }
    };

    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará permanentemente tu cuenta. Este proceso es irreversible. ¿Quieres continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                // Consulta para eliminar la cuenta
                const response = await axios.post('http://localhost:5000/api/ajustes-cuenta/eliminar-cuenta', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Tu cuenta ha sido eliminada correctamente.',
                        icon: 'success',
                    });
                    navigate('/');
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al eliminar la cuenta.',
                        icon: 'error',
                    });
                }
            } catch (error) {
                console.error('Error al eliminar la cuenta:', error);
                Swal.fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Hubo un problema al conectarse al servidor.',
                    icon: 'error',
                });
            }
        } else {
            console.log('Eliminación cancelada');
        }
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
                            checked={selectedField === 'name'}
                            onChange={() => handleCheckboxChange('name')}
                        />
                        <label htmlFor="updateName">Actualizar Nombre</label>
                    </div>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={selectedField !== 'name'}
                        required={selectedField === 'name'}
                        placeholder="Nuevo nombre" // Pista para el campo de nombre
                    />
                </div>
                <div className="field">
                    <div className="input-container">
                        <input
                            type="checkbox"
                            id="updateEmail"
                            checked={selectedField === 'email'}
                            onChange={() => handleCheckboxChange('email')}
                        />
                        <label htmlFor="updateEmail">Actualizar Correo</label>
                    </div>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={selectedField !== 'email'}
                        required={selectedField === 'email'}
                        placeholder="Nuevo correo" // Pista para el campo de correo
                    />
                </div>
                <div className="field">
                    <div className="input-container">
                        <input
                            type="checkbox"
                            id="updatePassword"
                            checked={selectedField === 'password'}
                            onChange={() => handleCheckboxChange('password')}
                        />
                        <label htmlFor="updatePassword">Actualizar Contraseña</label>
                    </div>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={selectedField !== 'password'}
                        required={selectedField === 'password'}
                        placeholder="Contraseña actual"
                    />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={selectedField !== 'password'}
                        required={selectedField === 'password'}
                        placeholder="Nueva contraseña"
                    />
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={selectedField !== 'password'}
                        required={selectedField === 'password'}
                        placeholder="Confirmar nueva contraseña"
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
