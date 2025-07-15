import { storage } from '../../storage';
import { useState, useEffect } from 'react';
import userHttp from '../../http-common/usuarios-http-common';
import { useParams, useNavigate } from 'react-router-dom';
import Navegacion from "../../components/Navegación.jsx";

/**
 * Componente funcional para la creación o edición de usuarios del sistema.
 * @module EditUser
 * @description Permite registrar o actualizar usuarios, mostrando un formulario con los campos necesarios.
 * @returns {JSX.Element} El formulario de usuario.
 */
export default function EditUser() {
    const userData = storage.getUserData();
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        rut: '',
        localidad: '',
        rol: '',
        email: '',
        password: ''
    });

    /**
     * Efecto para cargar los datos del usuario si existe un ID en la URL.
     * @function
     * @listens id
     * @description Busca y carga los datos del usuario correspondiente al ID proporcionado.
     */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await userHttp.get('/Usuario/obtenerUsuarios');
                const usuario = res.data.find(u => u.id === parseInt(id));
                if (usuario) {
                    setFormData(usuario);
                } else {
                    setError("Usuario no encontrado");
                }
            } catch (err) {
                console.error("Error al obtener usuario:", err);
                setError("Error al obtener los datos");
            }
        };

        fetchUser();
    }, [id]);

    /**
     * Maneja el cambio de los campos del formulario.
     * @function handleChange
     * @param {Event} event - Evento de cambio del input.
     */
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    /**
     * Maneja el envío del formulario de usuario.
     * @async
     * @function handleSubmit
     * @param {Event} event - Evento de envío del formulario.
     * @description Envía los datos del usuario al servidor y navega a la vista de gestión de usuarios si es exitoso.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await userHttp.post('/Usuario/actualizarUsuario', {
                nombre: formData.nombre,
                apellido: formData.apellido,
                rut: formData.rut,
                localidad: formData.localidad,
                password: formData.password,
                email: formData.email,
                rol: formData.rol
            });

            if (response.status === 200) {
                alert('Usuario registrado exitosamente');
                setFormData({
                    nombre: '',
                    apellido: '',
                    password: '',
                    rut: '',
                    localidad: '',
                    rol: '',
                    email: ''
                });
                navigate('/viewUsersAdministrador');
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert('Error al registrar el usuario. Por favor, intente nuevamente.');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            {/*Componente de navegación*/}
            <Navegacion titulo={`Editar datos del usuario [${userData.rol_usuario}]`} />
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className='grid grid-cols-2 gap-2'>
                                <div className='w-full'>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Ignacio"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        placeholder="Lara"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña
                                    </label>
                                    <input
                                        type="text"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ejemplo@correo.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
                                        RUT
                                    </label>
                                    <input
                                        type="text"
                                        id="rut"
                                        name="rut"
                                        value={formData.rut}
                                        onChange={handleChange}
                                        placeholder="11.222.333-4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>


                            </div>

                            <div className='grid grid-cols-2 gap-4'>

                                <div className='w-full'>
                                    <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                                        Rol
                                    </label>
                                    <select
                                        id="rol"
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    >
                                        <option value="">Seleccione un Rol</option>
                                        <option value={1}>Administrador</option>
                                        <option value={2}>Secretari@</option>
                                        <option value={3}>Medic@</option>
                                        <option value={4}>Psicólogo@</option>
                                        <option value={5}>Psicotécnic@</option>
                                    </select>
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="localidad" className="block text-sm font-medium text-gray-700 mb-1">
                                        Sucursal
                                    </label>
                                    <select
                                        id="localidad"
                                        name="localidad"
                                        value={formData.localidad}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    >
                                        <option value="">Seleccione una sucursal</option>
                                        <option value="Santiago">Santiago</option>
                                        <option value="Rancagua">Rancagua</option>
                                        <option value="Antofagasta">Antofagasta</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Enviar datos
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}