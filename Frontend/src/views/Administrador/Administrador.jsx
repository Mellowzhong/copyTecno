import { storage } from '../../storage';
import { useNavigate } from 'react-router-dom';

/**
 * Componente funcional para la página principal del área de administración.
 * @module Administrador
 * @description Muestra la bienvenida al usuario según su rol y proporciona acceso a funciones administrativas clave.
 * @returns {JSX.Element} La vista de bienvenida y acceso a las funciones administrativas.
 */
const Administrador = () => {
    const userData = storage.getUserData();
    const navigate = useNavigate();

    /**
     * Navega a la vista de registro de datos de conductor.
     * @function navigateToInstanceDriver
     */
    const navigateToInstanceDriver = () => {
        navigate('/InstanceDriver');
    };

    /**
     * Navega a la vista de gestión de usuarios.
     * @function navigateToAllUsers
     */
    const navigateToAddUser = () => {
        navigate('/InstanceUser');
    };
    /**
     * Navega a la vista para subir credenciales de conductor.
     * @function navigateToViewDriverAdministrador
     */
    const navigateToViewDriverAdministrador = () => {
        navigate('/ViewDriverAdministrador');
    };

    /**
     * Navega a la vista para agregar y gestionar usuarios.
     * @function navigateToViewUsersAdministrador
     */
    const navigateToViewUsersAdministrador = () => {
        navigate('/ViewUsersAdministrador');
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
                <button onClick={navigateToViewDriverAdministrador}
                    className="flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Subir Credencial
                </button>
                <button onClick={navigateToAddUser}
                    className="flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Añadir Usuario
                </button>
                <button onClick={navigateToViewUsersAdministrador}
                    className="flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Gestionar Usuarios
                </button>
            </div>
        </div>
    );
};

export default Administrador;