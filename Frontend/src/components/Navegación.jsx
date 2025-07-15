import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Componente funcional para la barra de navegación superior.
 * @module Navegacion
 * @description Muestra una barra delgada con un botón para regresar a la página anterior y un texto descriptivo del nombre de la vista actual.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.titulo - Texto que representa el nombre de la vista actual.
 * @returns {JSX.Element} Barra de navegación superior.
 */

export default function Navegacion({ titulo }) {
    const navigate = useNavigate();

    /**
     * Navega a la página anterior en el historial del navegador.
     * @function handleGoBack
     */
    const handleGoBack = () => {
        navigate(-1);
    };

    return (


        <div className="flex items-center bg-gray-100 px-4 py-2 shadow-sm border-b border-gray-300">
            <button
                onClick={handleGoBack}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
                <span className="mr-1">↩️</span>
                Regresar
            </button>
            <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-extrabold text-gray-900">
                {titulo}
            </h2>
        </div>
    );
}

// Validación de props
Navegacion.propTypes = {
    titulo: PropTypes.string.isRequired
};
