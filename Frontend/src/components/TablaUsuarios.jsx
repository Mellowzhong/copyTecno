import React, { useEffect, useState } from "react";
import UsuarioService from "../services/Usuarios-service";
import { getRole } from "../Utils/Role";

/**
 * Componente funcional para la visualización y edición de usuarios.
 * @module TablaUsuarios
 * @description Permite listar, editar y guardar cambios de usuarios en una tabla interactiva.
 * @returns {JSX.Element} Tabla de usuarios con opciones de edición y guardado.
 */
const TablaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({});

    /**
     * Efecto para cargar la lista inicial de usuarios.
     * @function
     * @listens (ninguno, solo se ejecuta una vez)
     * @description Realiza una petición al servidor para obtener la lista de usuarios.
     */
    useEffect(() => {
        UsuarioService.obtenerTodos()
            .then((res) => {
                setUsuarios(res.data);
            })
            .catch((err) => {
                console.error("Error al obtener usuarios:", err);
            });
    }, []);

    /**
     * Maneja el inicio de la edición de un usuario.
     * @function handleEditClick
     * @param {Object} usuario - Usuario que se va a editar.
     */
    const handleEditClick = (usuario) => {
        setEditingUserId(usuario.id_usuario);
        setEditedUser({ ...usuario }); // Copiamos los datos actuales del usuario
    };

    /**
     * Maneja el cambio de los campos del usuario en edición.
     * @function handleInputChange
     * @param {Event} e - Evento de cambio del input.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Guarda los cambios del usuario editado.
     * @async
     * @function saveUser
     * @description Envía los datos actualizados del usuario al servidor y actualiza la lista local.
     */
    const saveUser = () => {
        UsuarioService.guardarUsuario(editedUser)
            .then(() => {
                setUsuarios((prevUsuarios) =>
                    prevUsuarios.map((u) =>
                        u.id_usuario === editedUser.id_usuario ? editedUser : u
                    )
                );
                setEditingUserId(null);
                setEditedUser({});
            })
            .catch((err) => {
                console.error("Error al guardar el usuario:", err);
            });
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-6">
            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
                <thead>
                    <tr>
                        <th className="px-6 py-2 border-b text-left text-gray-700">Nombre y Apellido</th>
                        <th className="px-6 py-2 border-b text-left text-gray-700">Correo</th>
                        <th className="px-6 py-2 border-b text-left text-gray-700">Localidad</th>
                        <th className="px-6 py-2 border-b text-left text-gray-700">Rol</th>
                        <th className="px-6 py-2 border-b text-left text-gray-700">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id_usuario}>
                            <td className="px-6 py-2 border-b">
                                {editingUserId === usuario.id_usuario ? (
                                    <>
                                        <input
                                            name="nombre"
                                            value={editedUser.nombre}
                                            onChange={handleInputChange}
                                            className="border p-1 rounded mr-1 w-32"
                                        />
                                        <input
                                            name="apellido"
                                            value={editedUser.apellido}
                                            onChange={handleInputChange}
                                            className="border p-1 rounded w-32"
                                        />
                                    </>
                                ) : (
                                    `${usuario.nombre} ${usuario.apellido}`
                                )}
                            </td>
                            <td className="px-6 py-2 border-b">
                                {editingUserId === usuario.id_usuario ? (
                                    <input
                                        name="email"
                                        value={editedUser.email}
                                        onChange={handleInputChange}
                                        className="border p-1 rounded w-100"
                                    />
                                ) : (
                                    usuario.email
                                )}
                            </td>
                            <td className="px-6 py-2 border-b">
                                {editingUserId === usuario.id_usuario ? (
                                    <input
                                        name="localidad"
                                        value={editedUser.localidad}
                                        onChange={handleInputChange}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    usuario.localidad
                                )}
                            </td>
                            <td className="px-6 py-2 border-b">
                                {getRole(usuario.rol)}
                            </td>
                            <td className="px-6 py-2 border-b">
                                {editingUserId === usuario.id_usuario ? (
                                    <button
                                        onClick={saveUser}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Guardar cambios
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditClick(usuario)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                                        >
                                            Editar
                                        </button>
                                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                Añadir Trabajador
            </button>
        </div>
    );
};

export default TablaUsuarios;
