import { storage } from '../../storage';
import { useState, useEffect, useRef } from 'react';
import clienteHttp from '../../http-common/cliente-http-common';
import CompanyModal from '../../Modal/CompanyModal';
import Navegacion from '../../components/Navegación.jsx';

/**
 * Componente funcional para el registro de conductores en el sistema.
 * @module InstanceDriver
 * @description Permite registrar nuevos conductores, incluyendo sus datos personales y la empresa asociada.
 * @returns {JSX.Element} El formulario de registro de conductor.
 */
export default function InstanceDriver() {
    const storageUserData = storage.getUserData();
    const [empresas, setEmpresas] = useState([]);
    const [selectNewCompany, setSelectNewCompany] = useState(false);

    // Estados para feedback de empresa
    const [companyLoading, setCompanyLoading] = useState(false);
    const [companySuccess, setCompanySuccess] = useState('');
    const [companyError, setCompanyError] = useState('');

    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        apellido: '',
        rutBody: '',
        rutDv: '',
        nombre_empresa: '',
        fechaNacimiento: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        comuna: '',
        qrImage: null,
    });

    const [companyFormData, setCompanyFormData] = useState({
        nombreEmpresa: '',
        comunaEmpresa: '',
        rutBody: '',
        rutDv: '',
        direccionEmpresa: '',
        giro: '',
        emailEmpresa: '',
        telefonoEmpresa: ''
    });

    // Función para cargar empresas (puede ser llamada varias veces)
    const cargarEmpresas = async () => {
        try {
            const response = await clienteHttp.get('/Cliente/buscarEmpresas');
            if (response.status === 200) {
                setEmpresas(response.data);
            }
        } catch (error) {
            alert('Error al cargar la lista de empresas');
        }
    };

    useEffect(() => {
        cargarEmpresas();
    }, []);

    const handleNewCompanyToggle = () => {
        setSelectNewCompany(!selectNewCompany);
        setCompanySuccess('');
        setCompanyError('');
    };

    const formatRutBody = (value) => {
        const clean = value.replace(/[^0-9]/g, '');
        if (!clean) return '';
        return clean
            .split('')
            .reverse()
            .join('')
            .replace(/(\d{3})(?=\d)/g, '$1.')
            .split('')
            .reverse()
            .join('');
    };

    // Formulario conductor
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'rutBody') {
            setFormData(prevState => ({
                ...prevState,
                rutBody: formatRutBody(value)
            }));
        } else if (name === 'rutDv') {
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

    // Formulario empresa
    const handleCompanyChange = (event) => {
        const { name, value } = event.target;
        if (name === 'rutBody') {
            setCompanyFormData(prevState => ({
                ...prevState,
                rutBody: formatRutBody(value)
            }));
        } else if (name === 'rutDv') {
            const dv = value.replace(/[^0-9kK]/g, '').toUpperCase().slice(0, 1);
            setCompanyFormData(prevState => ({
                ...prevState,
                rutDv: dv
            }));
        } else {
            setCompanyFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Envío de nueva empresa
    const handleSubmitCompany = async (event) => {
        event.preventDefault();
        setCompanyLoading(true);
        setCompanySuccess('');
        setCompanyError('');
        const rutCompleto = `${companyFormData.rutBody}-${companyFormData.rutDv}`;
        try {
            const response = await clienteHttp.post('/Cliente/ingresarEmpresa', {
                nombreEmpresa: companyFormData.nombreEmpresa,
                comunaEmpresa: companyFormData.comunaEmpresa,
                rutEmpresa: rutCompleto,
                direccionEmpresa: companyFormData.direccionEmpresa,
                giro: companyFormData.giro,
                emailEmpresa: companyFormData.emailEmpresa,
                telefonoEmpresa: companyFormData.telefonoEmpresa
            });

            // Recarga empresas y selecciona la nueva
            await cargarEmpresas();
            setFormData(prev => ({
                ...prev,
                nombre_empresa: companyFormData.nombreEmpresa
            }));

            setCompanyFormData({
                nombreEmpresa: '',
                comunaEmpresa: '',
                rutBody: '',
                rutDv: '',
                direccionEmpresa: '',
                giro: '',
                emailEmpresa: '',
                telefonoEmpresa: ''
            });
            setCompanySuccess('¡Empresa registrada exitosamente!');
            setTimeout(() => {
                setSelectNewCompany(false);
                setCompanySuccess('');
            }, 1500); // Oculta el formulario tras 1.5 segundos
        } catch (error) {
            setCompanyError('Error al registrar la empresa. Por favor, intente nuevamente.');
        } finally {
            setCompanyLoading(false);
        }
    };

    // Envío de conductor
    const handleSubmit = async (event) => {
        event.preventDefault();
        const rutCompleto = `${formData.rutBody}-${formData.rutDv}`;
        try {
            const data = new FormData();
            const jsonConductor = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                run: rutCompleto,
                nombre_empresa: formData.nombre_empresa,
                fechaNacimiento: formData.fechaNacimiento,
                email: formData.email,
                telefono: formData.telefono,
                direccion: formData.direccion,
                comuna: formData.comuna,
                ciudad: formData.ciudad,
                id_usuario: storageUserData.id_usuario
            };

            data.append("conductor", new Blob([JSON.stringify(jsonConductor)], { type: "application/json" }));
            data.append("qrImage", formData.qrImage);

            let response;
            // Si hay un id, actualiza (PUT), si no, registra (POST)
            if (formData.id) {
                response = await clienteHttp.post('/Cliente/actualizarConductor', data, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            } else {
                response = await clienteHttp.post('/Cliente/ingresarConductor', data, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            if (response.status === 200) {
                alert(formData.id ? 'Conductor actualizado exitosamente' : 'Conductor registrado exitosamente');
                setFormData({
                    nombre: '',
                    apellido: '',
                    rutBody: '',
                    rutDv: '',
                    nombre_empresa: '',
                    fechaNacimiento: '',
                    email: '',
                    telefono: '',
                    direccion: '',
                    comuna: '',
                    ciudad: '',
                    qrImage: null,
                    id: null
                });
            }
        } catch (error) {
            console.error('Error al registrar/actualizar conductor:', error);
            alert('Error al registrar o actualizar el conductor. Por favor, intente nuevamente.');
        }
    };


    const handleSearchForRut = async () => {
        console.log("a")
        const rut = `${formData.rutBody}-${formData.rutDv}`;
        try {
            const response = await clienteHttp.get(`/Cliente/buscarConductor/${rut}`);
            if (response.status === 200 && response.data) {
                console.log('Conductor encontrado:', response.data);
                const conductor = response.data;
                setFormData({
                    ...formData,
                    id: conductor.id,
                    nombre: conductor.nombre || '',
                    apellido: conductor.apellido || '',
                    fechaNacimiento: conductor.fechaNacimiento || '',
                    email: conductor.email || '',
                    telefono: conductor.telefono || '',
                    direccion: conductor.direccion || '',
                    comuna: conductor.comuna || '',
                    ciudad: conductor.ciudad || '',
                    nombre_empresa: conductor.nombre_empresa || '',
                });
            }
        } catch (error) {
            alert('No se encontró un conductor con ese RUT.');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <Navegacion titulo={`Añadir un nuevo conductor [${storageUserData.rol_usuario}]`} />
            <div className="mx-auto max-w-2xl">
                {selectNewCompany && (
                    <CompanyModal
                        handleNewCompanyToggle={handleNewCompanyToggle}
                        handleSubmitCompany={handleSubmitCompany}
                        handleCompanyChange={handleCompanyChange}
                        companyFormData={companyFormData}
                        companyLoading={companyLoading}
                        companySuccess={companySuccess}
                        companyError={companyError}
                    />
                )}

                {/* Formulario de conductor */}
                <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
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
                            <div className='grid grid-cols-2 gap-2'>

                                <div className='w-full'>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombres
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
                                        Apellidos
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
                                    <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Nacimiento
                                    </label>
                                    <input
                                        type="date"
                                        id="fechaNacimiento"
                                        name="fechaNacimiento"
                                        value={formData.fechaNacimiento}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="flex rounded-md shadow-sm">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="ejemplo@gmail.com"
                                            className="flex-1 min-w-0 block w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        placeholder="+56 9 1234 5678"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        id="direccion"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        placeholder="Calle Principal 123"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                    />
                                </div>
                                <div className='w-full'>
                                    <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 mb-1">
                                        Comuna
                                    </label>
                                    <input
                                        type="text"
                                        id="comuna"
                                        name="comuna"
                                        value={formData.comuna}
                                        onChange={handleChange}
                                        placeholder="Ej: Santiago Centro"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                                        Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        id="ciudad"
                                        name="ciudad"
                                        value={formData.ciudad}
                                        onChange={handleChange}
                                        placeholder="Ej: Santiago"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor="nombre_empresa" className="block text-sm font-medium text-gray-700 mb-1">
                                        Compañía
                                    </label>
                                    <select
                                        id="nombre_empresa"
                                        name="nombre_empresa"
                                        value={formData.nombre_empresa}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                        required
                                        disabled={selectNewCompany}
                                    >
                                        <option value="">Seleccione una empresa</option>
                                        {empresas.map((empresa) => (
                                            <option key={empresa.id} value={empresa.nombreEmpresa}>
                                                {empresa.nombreEmpresa}
                                            </option>
                                        ))}
                                    </select>
                                    <div className='text-center'>
                                        <button
                                            type="button"
                                            onClick={handleNewCompanyToggle}
                                            className="mt-2 text-sm text-blue-500 hover:underline"
                                        >
                                            {selectNewCompany ? 'Cancelar' : 'Agregar nueva empresa'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-4'>
                            <div className='w-full'>
                                <label htmlFor="qrImage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Imagen QR
                                </label>
                                <input
                                    type="file"
                                    id="qrImage"
                                    name="qrImage"
                                    accept="image/*"
                                    onChange={(e) => setFormData(prev => ({ ...prev, qrImage: e.target.files[0] }))}
                                    required
                                />
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