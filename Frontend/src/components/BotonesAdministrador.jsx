/**
 * Componente funcional para los botones de acciones principales del administrador.
 * @module BotonesAdministrador
 * @description Agrupa y muestra los botones principales para la gestión de conductores y personal administrativo.
 * @param {Function} manejarGestionPersonal - Función que maneja la gestión de personal.
 * @param {Function} navigateToInstanceDriver - Función para navegar a la gestión de datos de conductores.
 * @param {Function} navigateToViewDriverAdministrador - Función para navegar a la subida de credenciales.
 * @returns {JSX.Element} Conjunto de botones de acciones administrativas.
 */
const BotonesAdministrador = ({ manejarGestionPersonal, navigateToInstanceDriver, navigateToViewDriverAdministrador }) => {
    return (
        <div className="flex flex-col space-y-4">
            <button
                onClick={navigateToViewDriverAdministrador}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
                Subir Credencial
            </button>
            <button
                onClick={navigateToInstanceDriver}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
                Gestionar Datos Conductores
            </button>
            <button
                onClick={manejarGestionPersonal}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
                Gestionar Personal
            </button>
        </div>
    );
};

export default BotonesAdministrador;
