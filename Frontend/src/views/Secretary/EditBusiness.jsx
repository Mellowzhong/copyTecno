import { storage } from '../../storage';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clienteHttp from "../../http-common/cliente-http-common.js";
import Navegacion from "../../components/Navegación.jsx";

/**
 * Componente funcional para la creación o edición de empresas.
 * @module EditBusiness
 * @description Permite registrar o actualizar empresas, mostrando un formulario con los campos necesarios.
 * @returns {JSX.Element} El formulario de empresa.
 */
export default function EditUser() {
    const userData = storage.getUserData();
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nombreEmpresa: '',
        comunaEmpresa: '',
        rutEmpresa: '',
        direccionEmpresa: '',
        giro: '',
        emailEmpresa: '',
        telefonoEmpresa: ''
    });

    /**
     * Efecto para cargar los datos de la Empresa si existe un ID en la URL.
     * @function
     * @listens id
     * @description Busca y carga los datos de la empresa correspondiente al ID proporcionado.
     */
    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const res = await clienteHttp.get('/Cliente/buscarEmpresas');
                const empresa = res.data.find(em => em.id === parseInt(id));
                if (empresa) {
                    setFormData(empresa);
                } else {
                    setError("Empresa no encontrado");
                }
            } catch (err) {
                console.error("Error al obtener empresa:", err);
                setError("Error al obtener los datos");
            }
        };

        fetchBusiness();
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
     * Maneja el envío del formulario de empresa.
     * @async
     * @function handleSubmit
     * @param {Event} event - Evento de envío del formulario.
     * @description Envía los datos de la empresa al servidor y navega a la vista de gestión de empresas si es exitoso.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await clienteHttp.post('/Cliente/actualizarEmpresa', {

                nombreEmpresa: formData.nombreEmpresa,
                comunaEmpresa: formData.comunaEmpresa,
                rutEmpresa: formData.rutEmpresa,
                direccionEmpresa: formData.direccionEmpresa,
                giro: formData.giro,
                emailEmpresa: formData.emailEmpresa,
                telefonoEmpresa: formData.telefonoEmpresa
            });

            if (response.status === 200) {
                alert('Empresa registrada exitosamente');
                setFormData({
                    nombreEmpresa: '',
                    comunaEmpresa: '',
                    rutEmpresa: '',
                    direccionEmpresa: '',
                    giro: '',
                    emailEmpresa: '',
                    telefonoEmpresa: ''
                });
                navigate('/viewBusinessSecretary');
            }
        } catch (error) {
            console.error('Error al registrar empresa:', error);
            alert('Error al registrar la empresa. Por favor, intente nuevamente.');
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <Navegacion titulo={`Editar datos de la empresa [${userData.rol_usuario}]`} />
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mt-6">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className='grid grid-cols-2 gap-2'>
                                <div className='w-full'>
                                    <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700 mb-1">
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
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='w-full'>
                                    <label htmlFor="rutEmpresa"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        RUT Empresa
                                    </label>
                                    <input
                                        type="text"
                                        id="rutEmpresa"
                                        name="rutEmpresa"
                                        value={formData.rutEmpresa}
                                        onChange={handleChange}
                                        placeholder="11.222.333-4"
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
                                    <label htmlFor="direccionEmpresa" className="block text-sm font-medium text-gray-700 mb-1">
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
                                    <label htmlFor="comunaEmpresa" className="block text-sm font-medium text-gray-700 mb-1">
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
                                    <label htmlFor="telefonoEmpresa" className="block text-sm font-medium text-gray-700 mb-1">
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