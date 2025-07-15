import { storage } from '../../storage';
import { useNavigate } from 'react-router-dom';

/**
 * Componente funcional para la página principal del área de psicología.
 * @module Psychologist
 * @description Muestra la bienvenida al usuario según su rol y permite navegar a la vista de gestión de formularios psicológicos.
 * @returns {JSX.Element} La vista de bienvenida y acceso a la gestión de formularios psicológicos.
 */
export default function Psychologist() {
    const userData = storage.getUserData();
    const navigate = useNavigate();

    /**
     * Navega a la vista de gestión de formularios psicológicos.
     * @function navigateToViewPsychologistForm
     */
    const navigateToViewDriverPsychologist = () => {
        navigate('/ViewDriverPsychologist');
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
            <div className='flex justify-center w-full'>
                <button
                    onClick={navigateToViewDriverPsychologist}
                    className="w-64 flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                >
                    Completar formulario
                </button>
            </div>
        </div>
    );
}