import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const renovarTokenSiEsNecesario = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const { exp } = jwtDecode(token); // Decodifica el token
    const ahora = Date.now() / 1000; // Tiempo actual en segundos

    if (exp - ahora < 300) { // Si quedan menos de 5 minutos
        try {
            const response = await axios.post('http://localhost:5000/api/renovar-token', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const nuevoToken = response.data.token;
            localStorage.setItem('token', nuevoToken);
            return nuevoToken;
        } catch (error) {
            console.error('Error al renovar token:', error);
            localStorage.removeItem('token');
            return null;
        }
    }

    return token; 
}
