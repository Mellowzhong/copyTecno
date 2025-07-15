import { useState, useEffect } from 'react';
import clienteHttp from '../../http-common/cliente-http-common';
import formularioHttp from '../../http-common/formulario-http-common';
import Navegacion from "../../components/Navegación.jsx";
import {storage} from "../../storage.js";

/**
 * Componente funcional para la visualización y gestión de conductores registrados.
 * @module AllDrivers
 * @description Permite listar y descargar archivos de formularios asociados a los conductores registrados en una fecha específica.
 * @returns {JSX.Element} La vista principal de gestión de conductores y descarga de archivos.
 */
export default function AllDrivers() {
    const [conductores, setConductores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fechaDesde, setFechaDesde] = useState(() => {
        const hoy = new Date();
        hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset()); // ajusta la zona horaria local
        return hoy.toISOString().split("T")[0];
    });
    const [inputFecha, setInputFecha] = useState(fechaDesde);
    const userData = storage.getUserData();


    /**
     * Efecto para cargar la lista de conductores según la fecha seleccionada.
     * @function
     * @listens fechaDesde
     * @description Realiza una petición al servidor para obtener los conductores registrados en la fecha especificada.
     */
    useEffect(() => {
        const cargarConductores = async () => {
            try {
                const response = await clienteHttp.get(`/Cliente/buscarConductores/fecha/${fechaDesde}`);
                console.log(response.data);
                if (response.status === 200) {
                    await setConductores(response.data);
                }
            } catch (error) {
                console.error('Error al cargar conductores:', error);
                setError('Error al cargar la lista de conductores');
            } finally {
                setLoading(false);
            }
        };

        cargarConductores();
    }, [fechaDesde]);

    /**
     * Obtiene los datos de un conductor por su ID.
     * @async
     * @function ObtenerDatosConductor
     * @param {number} idConductor - ID del conductor a buscar.
     * @returns {Promise<Object>} Datos del conductor.
     */
    const ObtenerDatosConductor = async (idConductor) => {
        const conductor = await clienteHttp.get(`/Cliente/buscarConductoresByID/${idConductor}`)
        return conductor.data;
    }

    /**
     * Maneja la descarga de archivos asociados a un conductor.
     * @async
     * @function handleDescargar
     * @param {number} idConductor - ID del conductor.
     * @description Descarga un archivo ZIP con los formularios del conductor seleccionado.
     */
    const handleDescargar = async (idConductor) => {
        try {
            const response = await formularioHttp.get(`/Formulario/zip/${idConductor}`, { responseType: 'blob' });
            if (response.status === 200) {
                const conductor = await ObtenerDatosConductor(idConductor);
                console.log(conductor)
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `documentos_cliente_${conductor.nombre}_${conductor.apellido}.zip`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                console.log("No se encontraron formularios");
                alert('No se encontraron formularios para este conductor');
            }
        } catch (error) {
            console.error('Error al descargar archivos:', error);
            alert('Error al descargar los archivos');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/*Componente de navegación*/}
            <Navegacion titulo={`Listado de conductores [${userData.rol_usuario}]`} />
            {/* Fecha */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                {/* Selector de fecha */}
                <div className="flex items-center gap-2">
                    <label htmlFor="fechaDesde" className="text-gray-700 font-medium">Desde:</label>
                    <input
                        type="date"
                        id="fechaDesde"
                        className="border border-gray-300 rounded px-3 py-2"
                        value={inputFecha}
                        onChange={(e) => setInputFecha(e.target.value)}
                        onBlur={() => setFechaDesde(inputFecha)} // solo actualiza la fecha real cuando se termina de editar
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();         // previene recarga o comportamiento inesperado
                                setFechaDesde(inputFecha); // actualiza la fecha real al presionar Enter
                            }
                        }}
                    />
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dirección
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {conductores.map((conductor) => (
                            <tr key={conductor.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {conductor.nombre} {conductor.apellido}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {conductor.direccion}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleDescargar(conductor.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                    >
                                        Descargar archivos
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}