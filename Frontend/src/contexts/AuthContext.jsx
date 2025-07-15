import { useState, useEffect } from 'react';
import clienteHttp from '../http-common/usuarios-http-common';
import { storage } from '../storage';
import { getRole, getPathRole } from '../Utils/Role';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

/**
 * Proveedor de autenticación para la aplicación.
 * @module AuthProvider
 * @description Gestiona el estado de autenticación, verificación de tokens, inicio y cierre de sesión.
 * @param {ReactNode} children - Componentes hijos que tendrán acceso al contexto de autenticación.
 * @returns {JSX.Element} Proveedor de contexto de autenticación.
 */
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Efecto para verificar el token de autenticación al cargar el componente.
     * @function
     * @listens (ninguno, solo se ejecuta una vez)
     * @description Verifica la validez del token con el backend y actualiza el estado de autenticación.
     */
    useEffect(() => {
        setLoading(true);
        clienteHttp.post('/Usuario/verify-token')
            .then(response => {
                setIsAuthenticated(true);
                setUser(response.data.user);
            })
            .catch(() => {
                storage.clearUserData();
                setIsAuthenticated(false);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    /**
     * Efecto para redirigir usuarios autenticados que visitan la página de login.
     * @function
     * @listens location.pathname
     * @description Redirige a los usuarios autenticados a su página principal según su rol.
     */
    useEffect(() => {
        if (location.pathname === '/login') {
            const userData = storage.getUserData();
            if (userData) {
                const rol = getPathRole(userData.rol_usuario);
                navigate(rol);
            }
        }
    }, [location.pathname, navigate]);

    /**
     * Maneja el inicio de sesión de usuarios.
     * @async
     * @function login
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<boolean>} `true` si el inicio de sesión es exitoso, `false` en caso contrario.
     * @description Autentica al usuario, guarda sus datos en el almacenamiento local y redirige según su rol.
     */
    const login = async (email, password) => {
        try {
            const response = await clienteHttp.post('/Usuario/login', { email, password });
            setIsAuthenticated(true);
            // Guardar los datos del usuario en el storage
            const userRole = getRole(response.data.rol_usuario);

            const newUserData = {
                rol_usuario: userRole,
                nombre_usuario: response.data.nombre,
                id_usuario: response.data.id_usuario,

            };
            storage.setUserData(newUserData);

            // Redirigir según el rol solo después del login exitoso
            const rol = getPathRole(userRole);
            navigate(rol);

            return true;
        } catch (error) {
            return false;
        }
    };

    /**
     * Maneja el cierre de sesión de usuarios.
     * @async
     * @function logout
     * @description Cierra la sesión del usuario, limpia los datos de almacenamiento y redirige al login.
     */
    const logout = async () => {
        try {
            const response = await clienteHttp.post('/Usuario/logout');
            if (response.status === 200) {
                storage.clearUserData();
                setIsAuthenticated(false);
                setUser(null);
                navigate('/login');
            }
        } catch (error) {
            console.error('Error durante el logout:');
            // Aún así, limpiamos los datos y redirigimos al login
            storage.clearUserData();
            setIsAuthenticated(false);
            setUser(null);
            navigate('/login');
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}; 