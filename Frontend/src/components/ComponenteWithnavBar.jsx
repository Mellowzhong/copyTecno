import { useAuth } from '../hooks/useAuth';
import { storage } from '../storage';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Componente contenedor con barra de navegación superior.
 * @module ComponenteWithnavBar
 * @description Proporciona una estructura común con barra de navegación para las páginas de la aplicación, mostrando opciones de inicio de sesión y cierre de sesión según la autenticación del usuario.
 * @param {ReactNode} children - Componentes hijos que se renderizarán en el contenido principal.
 * @returns {JSX.Element} Contenedor con barra de navegación y área de contenido principal.
 */
const ComponenteWithnavBar = ({ children }) => {
    const { isAuthenticated, logout } = useAuth();
    const userData = storage.getUserData();
    const navigate = useNavigate();

    /**
     * Maneja la navegación al hacer clic en el logo.
     * @function handleLogoClick
     * @description Navega a la página de inicio de sesión.
     */
    const handleLogoClick = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav style={{ backgroundColor: '#f9f9f9' }} className="shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div
                            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={handleLogoClick}
                        >
                            <img src='../assets/Quality_Trans_logo.png' alt="logo" className="h-12 w-18 mr-4"  />
                            <span className="text-blue-600 text-xl font-semibold font-serif">T</span>
                            <span className="text-red-600 text-xl font-semibold font-serif">ecno </span>
                            <span className="text-blue-600 text-xl font-semibold font-serif">Q</span>
                            <span className="text-red-600 text-xl font-semibold font-serif">uality</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-gray-700">
                                        {userData?.nombre_usuario || 'Usuario'}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};

export default ComponenteWithnavBar;