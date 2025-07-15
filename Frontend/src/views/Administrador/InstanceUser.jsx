import { storage } from '../../storage';
import { useState, useEffect } from 'react';
import userHttp from '../../http-common/usuarios-http-common';
import { useNavigate } from 'react-router-dom';
import Navegacion from "../../components/Navegación.jsx";
import usuariosHttp from '../../http-common/usuarios-http-common';

/**
 * Componente funcional para el registro de usuarios.
 * @module InstanceUser
 * @description Permite registrar usuarios en el sistema mediante un formulario con campos como nombre, apellido, rut, localidad, rol, email y password.
 * @returns {JSX.Element} El formulario de registro de usuario.
 */
export default function InstanceUser() {
    const userData = storage.getUserData();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        rutBody: '',
        rutDv: '',
        localidad: '',
        rol: '',
        email: '',
        password: ''
    });


    const formatRutBody = (value) => {
        // Elimina todo lo que no sea número
        const clean = value.replace(/[^0-9]/g, '');
        if (!clean) return '';
        // Invierte, separa en grupos de 3, vuelve a invertir y une con puntos
        return clean
            .split('')
            .reverse()
            .join('')
            .replace(/(\d{3})(?=\d)/g, '$1.')
            .split('')
            .reverse()
            .join('');
    }


    /**
     * Maneja el cambio de los campos del formulario.
     * @function handleChange
     * @param {Event} event - Evento de cambio del input.
     */
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'rutBody') {
            setFormData(prevState => ({
                ...prevState,
                rutBody: formatRutBody(value)
            }));
        } else if (name === 'rutDv') {
            // Solo permite 1 caracter, número o k/K
            const dv = value.replace(/[^0-9kK]/g, '').toUpperCase().slice(0, 1);
            setFormData(prevState => ({
                ...prevState,
                rutDv: dv
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };


    /**
     * Maneja el envío del formulario de usuario.
     * @async
     * @function handleSubmit
     * @param {Event} event - Evento de envío del formulario.
     * @description Envía los datos del usuario al servidor para su registro y muestra un mensaje de éxito o error.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const rutCompleto = `${formData.rutBody}-${formData.rutDv}`;

        // Construye el payload
        const usuarioPayload = {
            id: formData.id,
            nombre: formData.nombre,
            apellido: formData.apellido,
            rut: rutCompleto,
            localidad: formData.localidad,
            password: formData.password,
            email: formData.email + '@qualitytrans.cl',
            rol: formData.rol
        };

        try {
            let response;
            // Si hay un id, actualiza (PUT), si no, registra (POST)
            if (formData.id) {
                console.log("Actualizando usuario con ID:", formData.id);
                console.log("Datos del usuario a actualizar:", usuarioPayload);
                response = await userHttp.post('/Usuario/actualizarUsuario', usuarioPayload);
            } else {
                console.log("Registrando nuevo usuario");
                response = await userHttp.post('/Usuario/ingresarUsuario', usuarioPayload);
            }

            if (response.status === 200) {
                alert(formData.id ? 'Usuario actualizado exitosamente' : 'Usuario registrado exitosamente');
                setFormData({
                    nombre: '',
                    apellido: '',
                    password: '',
                    rutBody: '',
                    rutDv: '',
                    localidad: '',
                    rol: '',
                    email: '',
                    id: null
                });
                navigate(-1);
            }
        } catch (error) {
            console.error('Error al registrar/actualizar usuario:', error);
            alert('Error al registrar o actualizar el usuario. Por favor, intente nuevamente.');
        }
    };



    const handleSearchForRut = async () => {
        console.log("a")
        const rut = `${formData.rutBody}-${formData.rutDv}`;
        try {
            const response = await usuariosHttp.get(`/Usuario/obtenerUsuario/${rut}`);
            console.log("b")
            if (response.status === 200 && response.data) {
                console.log('Usuario encontrado:', response.data);
                const usuario = response.data;
                setFormData({
                    ...formData,
                    id: usuario.id || null,
                    nombre: usuario.nombre || '',
                    apellido: usuario.apellido || '',
                    localidad: usuario.localidad || '',
                    rol: usuario.rol || '',
                    email: usuario.email.split('@')[0] || '',
                    password: usuario.password || '',
                });
            }
        } catch (error) {
            alert('No se encontró un usuario con ese RUT.');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            {/*Componente de navegación*/}
            <Navegacion titulo={`Añadir un nuevo usuario [${userData.rol_usuario}]`} />
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* RUT y Dígito verificador */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label htmlFor="rutBody" className="block text-sm font-medium text-gray-700 mb-1">
                                    RUT
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        id="rutBody"
                                        name="rutBody"
                                        value={formData.rutBody}
                                        onChange={handleChange}
                                        placeholder="11.222.333"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                        maxLength={10}
                                    />
                                    <span className="flex items-center font-bold">-</span>
                                    <input
                                        type="text"
                                        id="rutDv"
                                        name="rutDv"
                                        value={formData.rutDv}
                                        onChange={handleChange}
                                        placeholder="K"
                                        className="w-1/6 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center"
                                        required
                                        maxLength={1}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleSearchForRut}
                                className="w-3/4 mt-4 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Buscar por RUT
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div>
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
                            {/* Apellido */}
                            <div>
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
                            {/* Contraseña */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña
                                </label>
                                <input
                                    type="text"
                                    id="password"
                                    name="password"
                                    placeholder='Ingrese una contraseña'
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    required
                                />
                            </div>
                            {/* Email */}
                            <div className='w-full'>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ejemplo"
                                        className="flex-1 min-w-0 block w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        @qualitytrans.cl
                                    </span>
                                </div>
                            </div>
                            <div>
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
                            {/* Sucursal */}
                            <div>
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