import { storage } from '../../storage.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import usuariosHttp from '../../http-common/usuarios-http-common.js';
import { getRole } from '../../utils/Role';
import Navegacion from "../../components/Navegación.jsx";

/**
 * Componente funcional para la visualización y gestión de usuarios del sistema.
 * @module ViewUsersAdministrador
 * @description Permite visualizar, filtrar, editar y eliminar usuarios según su rol y localidad.
 * @returns {JSX.Element} La vista principal de gestión de usuarios.
 */
const ViewUsersAdministrador = () => {
    // Estado para los datos del usuario
    const userData = storage.getUserData();
    const navigate = useNavigate();
    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRol, setSelectedRol] = useState("");
    const [selectedLocalidad, setSelectedLocalidad] = useState("");

    // Estado para los conductores filtrados
    const [usuariosFiltrados, setUsuariosFiltrados] = useState(users)

    /**
     * Efecto para filtrar usuarios según término de búsqueda, rol y localidad.
     * @function
     * @listens searchTerm, selectedRol, selectedLocalidad, users
     * @description Actualiza la lista de usuarios filtrados cuando cambian los filtros.
     */
    useEffect(() => {
        const filtrados = users.filter((user) => {
            const coincideNombre = user.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const coincideRol = selectedRol === "" || user.rol === parseInt(selectedRol);
            const coincideLocalidad = selectedLocalidad === "" || user.localidad === selectedLocalidad;
            return coincideNombre && coincideRol && coincideLocalidad;
        });

        setUsuariosFiltrados(filtrados);
    }, [searchTerm, selectedRol, selectedLocalidad, users]);

    /**
     * Efecto para cargar la lista inicial de usuarios.
     * @function
     * @listens (ninguno, solo se ejecuta una vez)
     * @description Realiza la carga inicial de usuarios desde el servidor.
     */
    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const response = await usuariosHttp.get(`/Usuario/obtenerUsuarios`);
                console.log(response.data);
                if (response.status === 200) {
                    setUsers(response.data);
                }
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
                setError('Error al cargar la lista de usuarios');
            } finally {
                setLoading(false);
            }
        };

        cargarUsuarios();
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
     * Maneja el cambio en el filtro de rol.
     * @function handleRolChange
     * @param {Event} event - Evento de cambio del select de rol.
     */
    const handleRolChange = (e) => {
        setSelectedRol(e.target.value);
    };

    /**
     * Maneja el cambio en el filtro de localidad.
     * @function handleLocalidadChange
     * @param {Event} event - Evento de cambio del select de localidad.
     */
    const handleLocalidadChange = (e) => {
        setSelectedLocalidad(e.target.value);
    };

    /**
     * Maneja la eliminación de un usuario.
     * @async
     * @function handleEliminar
     * @param {number} id - ID del usuario a eliminar.
     * @description Elimina el usuario del sistema tras confirmación y actualiza la lista.
     */
    const handleEliminar = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
        if (!confirmacion) return;
        try {
            const response = await usuariosHttp.delete(`/Usuario/eliminarUsuarioById/${id}`);
            console.log(response.data.message);
            // Actualizar la lista de usuarios sin el eliminado
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            setError("No se pudo eliminar el usuario.");
        }
    };

    /**
     * Navega a la vista de edición de un usuario.
     * @function navigateToEditarUsuario
     * @param {number} id - ID del usuario a editar.
     */
    const navigateToEditarUsuario = (id) => {
        navigate(`/EditUser/${id}`);
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
            <Navegacion titulo={`Listado y gestión de usuarios [${userData.rol_usuario}]`} />
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
                            placeholder="Buscar usuario"
                            className="pl-10 py-2 border border-gray-300 rounded-full w-full"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Filtros */}
                    <div className="flex gap-4 w-full md:w-auto">
                        {/* Filtro por Rol */}
                        <select
                            value={selectedRol}
                            onChange={handleRolChange}
                            className="py-2 px-4 border border-gray-300 rounded-full"
                        >
                            <option value="">Todos los roles</option>
                            <option value="1">Administrador</option>
                            <option value="2">Secretari@</option>
                            <option value="3">Medic@</option>
                            <option value="4">Psicólog@</option>
                            <option value="5">Psicotécnic@</option>
                        </select>

                        {/* Filtro por Localidad */}
                        <select
                            value={selectedLocalidad}
                            onChange={handleLocalidadChange}
                            className="py-2 px-4 border border-gray-300 rounded-full"
                        >
                            <option value="">Todas las sucursales</option>
                            <option value="Santiago">Santiago</option>
                            <option value="Rancagua">Rancagua</option>
                            <option value="Antofagasta">Antofagasta</option>
                        </select>
                    </div>
                </div>


                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="py-3 px-4 bg-blue-200 text-left text-lg font-medium text-gray-800 border border-gray-300">
                                    Nombre Usuario
                                </th>
                                <th className="py-3 px-4 bg-blue-200 text-center text-lg font-medium text-gray-800 border border-gray-300">
                                    Rol
                                </th>
                                <th className="py-3 px-4 bg-blue-200 text-center text-lg font-medium text-gray-800 border border-gray-300">
                                    Localidad
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
                            {usuariosFiltrados.map((usuario) => (
                                <tr key={usuario.id} className="border border-gray-300">
                                    <td className="py-3 px-4 text-gray-800 border border-gray-300">{usuario.nombre + " " + usuario.apellido}</td>
                                    <td className="py-3 px-4 text-gray-800 border border-gray-300">{getRole(usuario.rol)}</td>
                                    <td className="py-3 px-4 text-gray-800 border border-gray-300">{usuario.localidad}</td>
                                    <td className="py-3 px-4 text-center border border-gray-300">
                                        <button
                                            onClick={() => navigateToEditarUsuario(usuario.id)}
                                            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-4 rounded"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                    <td className="py-3 px-4 text-center border border-gray-300">
                                        <button
                                            onClick={() => handleEliminar(usuario.id)}
                                            disabled={usuario.id === userData.id_usuario}
                                            className={`${usuario.id === userData.id_usuario
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-red-600 hover:bg-red-700"
                                                } text-white font-bold py-1 px-4 rounded`}
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

export default ViewUsersAdministrador