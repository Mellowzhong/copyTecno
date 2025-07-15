import { storage } from '../../storage';
import { useNavigate } from 'react-router-dom';

/**
 * Componente funcional para la página principal del área psicotécnica.
 * @module Psicotecnica
 * @description Muestra la bienvenida al usuario según su rol y permite navegar a la gestión de archivos psicotécnicos de conductores.
 * @returns {JSX.Element} La vista de bienvenida y acceso a las funciones psicotécnicas.
 */
const Psicotecnica = () => {
    const userData = storage.getUserData();
    const navigate = useNavigate();

    /**
     * Navega a la vista de gestión de archivos psicotécnicos de conductores.
     * @function navigateToViewDriverPsicotecnica
     */
    const navigateToViewDriverPsicotecnica = () => {
        navigate('/ViewDriverPsicotecnica');
    };

        /**
     * Navega a la vista de gestión de archivos psicotécnicos de conductores.
     * @function navigateToViewDriverQRPsicotecnica
     */
    const navigateToViewDriverQRPsicotecnica = () => {
        navigate('/ViewDriverQRPsicotecnica');
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
                <button onClick={navigateToViewDriverQRPsicotecnica} className="flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Insertar QR en documento
                </button>
                <button onClick={navigateToViewDriverPsicotecnica} className="flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Subir archivo de conductor
                </button>
            </div>
        </div>
    );
};

export default Psicotecnica;