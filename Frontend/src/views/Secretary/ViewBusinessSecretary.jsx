import { storage } from '../../storage.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import clienteHttp from "../../http-common/cliente-http-common.js";
import Navegacion from "../../components/Navegación.jsx";

/**
 * Componente funcional para la visualización y gestión de empresas.
 * @module ViewBusinessSecretary
 * @description Permite visualizar, filtrar, editar y eliminar empresas.
 * @returns {JSX.Element} La vista principal de gestión de empresas.
 */
const ViewBusinessSecretary = () => {
    // Estado para los datos de la empresa
    const userData = storage.getUserData();
    const navigate = useNavigate();
    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState("")
    const [business, setBusiness] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para las empresas filtrados
    const [empresasFiltradas, setEmpresasFiltradas] = useState(business)

    /**
     * Efecto para filtrar empresas según término de búsqueda.
     * @function
     * @listens searchTerm, business
     * @description Actualiza la lista de empresas filtradas cuando cambian los filtros.
     */
    useEffect(() => {
        const filtradas = business.filter((bus1ness) => {
            const coincideNombre = bus1ness.nombreEmpresa.toLowerCase().includes(searchTerm.toLowerCase());
            return coincideNombre;
        });

        setEmpresasFiltradas(filtradas);
    }, [searchTerm, business]);

    /**
     * Efecto para cargar la lista inicial de empresas.
     * @function
     * @listens (ninguno, solo se ejecuta una vez)
     * @description Realiza la carga inicial de empresas desde el servidor.
     */
    useEffect(() => {
        const cargarEmpresas = async () => {
            try {
                const response = await clienteHttp.get(`/Cliente/buscarEmpresas`);
                console.log(response.data);
                if (response.status === 200) {
                    setBusiness(response.data);
                }
            } catch (error) {
                console.error('Error al cargar empresas:', error);
                setError('Error al cargar la lista de empresas');
            } finally {
                setLoading(false);
            }
        };

        cargarEmpresas();
    }, []);

    /**
     * Maneja el cambio en el campo de búsqueda.
     * @function handleSearch
     * @param {Event} event - Evento de cambio del input de búsqueda.
     */
    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    /**
     * Maneja la eliminación de una empresa.
     * @async
     * @function handleEliminar
     * @param {number} id - ID de la empresa a eliminar.
     * @description Elimina la empresa del sistema tras confirmación y actualiza la lista.
     */
    const handleEliminar = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta empresa?");
        if (!confirmacion) return;
        try {
            const response = await clienteHttp.delete(`/Cliente/eliminarEmpresaById/${id}`);
            console.log(response.data.message);
            // Actualizar la lista de empresas sin el eliminado
            setBusiness((prev) => prev.filter((bus1ness) => bus1ness.id !== id));
        } catch (error) {
            console.error("Error al eliminar empresa:", error);
            setError("No se pudo eliminar la empresa.");
        }
    };

    /**
     * Navega a la vista de edición de una empresa.
     * @function navigateToEditarEmpresa
     * @param {number} id - ID de la empresa a editar.
     */
    const navigateToEditarEmpresa = (id) => {
        navigate(`/EditBusiness/${id}`);
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
        <div className="min-h-screen bg-gray-50">
            {/*Componente de navegación*/}
            <Navegacion titulo={`Listado de empresas [${userData.rol_usuario}]`} />
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Search Bar y Filtros */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* Input de búsqueda */}
                    <div className="relative w-full md:w-1/2">
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar empresa"
                            className="pl-10 py-2 border border-gray-300 rounded-full w-full"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>


                {/* Business Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="py-3 px-4 bg-blue-200 text-left text-lg font-medium text-gray-800 border border-gray-300">
                                Nombre Empresa
                            </th>
                            <th className="py-3 px-4 bg-blue-200 text-center text-lg font-medium text-gray-800 border border-gray-300">
                                Giro
                            </th>
                            <th className="py-3 px-4 bg-blue-200 text-center text-lg font-medium text-gray-800 border border-gray-300">
                                Comuna
                            </th>
                            <th className="py-3 px-4 bg-blue-200 text-center text-lg font-medium text-gray-800 border border-gray-300">
                                Editar
                            </th>
                            <th className="py-3 px-4 bg-blue-200 text-center text-lg font-medium text-gray-800 border border-gray-300">
                                Eliminar
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {empresasFiltradas.map((empresa) => (
                            <tr key={empresa.id} className="border border-gray-300">
                                <td className="py-3 px-4 text-gray-800 border border-gray-300">{empresa.nombreEmpresa}</td>
                                <td className="py-3 px-4 text-gray-800 border border-gray-300">{empresa.giro}</td>
                                <td className="py-3 px-4 text-gray-800 border border-gray-300">{empresa.comunaEmpresa}</td>
                                <td className="py-3 px-4 text-center border border-gray-300">
                                    <button
                                        onClick={() => navigateToEditarEmpresa(empresa.id)}
                                        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-4 rounded"
                                    >
                                        Editar
                                    </button>
                                </td>
                                <td className="py-3 px-4 text-center border border-gray-300">
                                    <button
                                        onClick={() => handleEliminar(empresa.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                                    >
                                        Eliminar
                                    </button>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

export default ViewBusinessSecretary