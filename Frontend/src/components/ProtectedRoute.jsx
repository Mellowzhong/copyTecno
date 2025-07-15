import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ComponenteWithnavBar from '../components/ComponenteWithnavBar';

/**
 * Componente funcional para proteger rutas privadas.
 * @module ProtectedRoute
 * @description Restringe el acceso a rutas protegidas solo a usuarios autenticados. Si el usuario no está autenticado, redirige al login.
 * @param {ReactNode} children - Componentes hijos que se renderizarán solo si el usuario está autenticado.
 * @returns {JSX.Element} Los componentes hijos envueltos en la barra de navegación, o una redirección al login si no está autenticado.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <ComponenteWithnavBar>
            {children}
        </ComponenteWithnavBar>

    );
};

export default ProtectedRoute;