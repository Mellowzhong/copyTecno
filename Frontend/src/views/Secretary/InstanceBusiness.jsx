import { storage } from '../../storage';
import { useState, useEffect } from 'react';
import clienteHttp from "../../http-common/cliente-http-common.js";
import Navegacion from "../../components/Navegación.jsx";

/**
 * Componente funcional para el registro de empresas.
 * @module InstanceBusinesss
 * @description Permite registrar empresas en el sistema mediante un formulario con distintos campos.
 * @returns {JSX.Element} El formulario de registro de empresa.
 */
export default function InstanceBusiness() {
    const userData = storage.getUserData();
    const [formData, setFormData] = useState({
        nombreEmpresa: '',
        comunaEmpresa: '',
        rutBody: '',
        rutDv: '',
        direccionEmpresa: '',
        giro: '',
        emailEmpresa: '',
        telefonoEmpresa: ''
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
     * Maneja el envío del formulario de empresa.
     * @async
     * @function handleSubmit
     * @param {Event} event - Evento de envío del formulario.
     * @description Envía los datos de la empresa al servidor para su registro y muestra un mensaje de éxito o error.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validación básica
        if (!formData.nombreEmpresa || !formData.comunaEmpresa || !formData.rutBody || !formData.rutDv) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        const rutCompleto = `${formData.rutBody}-${formData.rutDv}`;
        const empresaPayload = {
            nombreEmpresa: formData.nombreEmpresa,
            comunaEmpresa: formData.comunaEmpresa,
            rutEmpresa: rutCompleto,
            direccionEmpresa: formData.direccionEmpresa,
            giro: formData.giro,
            emailEmpresa: formData.emailEmpresa,
            telefonoEmpresa: formData.telefonoEmpresa
        };

        try {
            let response;

            // Si hay un id, actualiza. Si no, crea.
            if (formData.id) {
                console.log('Actualizando empresa');
                response = await clienteHttp.post(
                    '/Cliente/actualizarEmpresa',
                    empresaPayload
                );
            } else {
                console.log('Registrando nueva empresa');
                response = await clienteHttp.post(
                    '/Cliente/ingresarEmpresa',
                    empresaPayload
                );
            }

            if (response.status === 200) {
                alert(formData.id ? 'Empresa actualizada exitosamente' : 'Empresa registrada exitosamente');
                setFormData({
                    nombreEmpresa: '',
                    comunaEmpresa: '',
                    rutBody: '',
                    rutDv: '',
                    direccionEmpresa: '',
                    giro: '',
                    emailEmpresa: '',
                    telefonoEmpresa: '',
                    id: null
                });
            } else {
                alert('Ocurrió un problema inesperado. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al registrar/actualizar empresa:', error);
            alert('Error al registrar o actualizar la empresa. Por favor, intente nuevamente.');
        }
    };


    const handleSearchForRut = async () => {
        const rut = `${formData.rutBody}-${formData.rutDv}`;
        try {
            const response = await clienteHttp.get(`/Cliente/buscarEmpresa/${rut}`);
            if (response.status === 200 && response.data) {
                console.log('e,presa encontrado:', response.data);
                const empresa = response.data;
                setFormData({
                    ...formData,
                    id: empresa.id || '',
                    nombreEmpresa: empresa.nombreEmpresa || '',
                    comunaEmpresa: empresa.comunaEmpresa || '',
                    direccionEmpresa: empresa.direccionEmpresa || '',
                    giro: empresa.giro || '',
                    emailEmpresa: empresa.emailEmpresa || '',
                    telefonoEmpresa: empresa.telefonoEmpresa || ''
                });
            }
        } catch (error) {
            alert('No se encontró una empresa con ese RUT.');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <Navegacion titulo={`Añadir una nueva empresa [${userData.rol_usuario}]`} />
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
                        <div className="space-y-4">
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor="nombreEmpresa"
                                        className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre de la Empresa
                                    </label>
                                    <input
                                        type="text"
                                        id="nombreEmpresa"
                                        name="nombreEmpresa"
                                        value={formData.nombreEmpresa}
                                        onChange={handleChange}
                                        placeholder="Compania Limitada"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="giro" className="block text-sm font-medium text-gray-700 mb-1">
                                        Giro
                                    </label>
                                    <input
                                        type="text"
                                        id="giro"
                                        name="giro"
                                        value={formData.giro}
                                        onChange={handleChange}
                                        placeholder="Mueblería"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor="direccionEmpresa"
                                        className="block text-sm font-medium text-gray-700 mb-1">
                                        Dirección de la Empresa
                                    </label>
                                    <input
                                        type="text"
                                        id="direccionEmpresa"
                                        name="direccionEmpresa"
                                        value={formData.direccionEmpresa}
                                        onChange={handleChange}
                                        placeholder="Calle Principal 123"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="comunaEmpresa"
                                        className="block text-sm font-medium text-gray-700 mb-1">
                                        Comuna de la Empresa
                                    </label>
                                    <input
                                        type="text"
                                        id="comunaEmpresa"
                                        name="comunaEmpresa"
                                        value={formData.comunaEmpresa}
                                        onChange={handleChange}
                                        placeholder="Santiago"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor="emailEmpresa"
                                        className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="emailEmpresa"
                                        name="emailEmpresa"
                                        value={formData.emailEmpresa}
                                        onChange={handleChange}
                                        placeholder="ejemplo@correo.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="telefonoEmpresa"
                                        className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="telefonoEmpresa"
                                        name="telefonoEmpresa"
                                        value={formData.telefonoEmpresa}
                                        onChange={handleChange}
                                        placeholder="+56 9 1234 5678"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
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