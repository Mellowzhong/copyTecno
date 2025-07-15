import { storage } from '../../storage';
import { useNavigate } from 'react-router-dom';

/**
 * Componente funcional para la página principal del área de secretaría.
 * @module Secretary
 * @description Muestra la bienvenida al usuario según su rol y permite navegar a la gestión de conductores.
 * @returns {JSX.Element} La vista de bienvenida y acceso a las funciones de secretaría.
 */
const Secretary = () => {
    const userData = storage.getUserData();
    const navigate = useNavigate();

    /**
     * Navega a la vista de registro de conductores.
     * @function navigateToInstanceDriver
     */
    const navigateToInstanceDriver = () => {
        navigate('/InstanceDriver');
    };

    /**
     * Navega a la vista de registro de empresas.
     * @function navigateToInstanceBussiness
     */
    const navigateToInstanceBusiness = () => {
        navigate('/InstanceBusiness');
    };

    /**
     * Navega a la vista de visualización de todas las empresas.
     * @function navigateToAllBusiness
     */
    const navigateToAllBusiness = () => {
        navigate('/ViewBusinessSecretary');
    };

    /**
     * Navega a la vista de visualización de todos los conductores del día.
     * @function navigateToAllDrivers
     */
    const navigateToAllDrivers = () => {
        navigate('/AllDrivers');
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div className='mb-8'>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    <span>Bienvenido a </span>
                    <span className="text-blue-600 text-3xl font-semibold font-serif">T</span>
                    <span className="text-red-600 text-3xl font-semibold font-serif">ecno </span>
                    <span className="text-blue-600 text-3xl font-semibold font-serif">Q</span>
                    <span className="text-red-600 text-3xl font-semibold font-serif">uality</span>
                    <span>, su rol es: {userData.rol_usuario}</span>
                </h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl'>
                <button onClick={navigateToInstanceDriver}
                        className="flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Registrar datos de conductor
                </button>
                <button onClick={navigateToAllDrivers}
                        className="flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Visualizar conductores del día
                </button>
                <button onClick={navigateToInstanceBusiness}
                        className="flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Registrar datos de empresa
                </button>
                <button onClick={navigateToAllBusiness}
                        className="flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Visualizar listado de empresas
                </button>
            </div>

        </div>
    );
};

export default Secretary;