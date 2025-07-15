import { useState, useEffect, useRef } from 'react';
import clienteHttp from '../../http-common/cliente-http-common';
import formularioHttp from '../../http-common/formulario-http-common';
import { useNavigate, useLocation } from "react-router-dom"
import { storage } from '../../storage';
import SignaturePad from 'react-signature-canvas';

/**
 * Componente funcional para el formulario médico de evaluación.
 * @module MedicForm
 * @description Permite registrar y enviar datos médicos de un conductor.
 * @returns {JSX.Element} El formulario de evaluación médica.
 */
export default function MedicForm() {
    // Supón que el ID del conductor viene de la URL o de algún estado global
    /*const [idConductor, setIdConductor] = useState(1); // Ejemplo: puedes recibirlo por URL o props
    const [idUsuario, setIdUsuario] = useState(() => {
        // Get idUsuario using the storage utility
        return storage.getUserId();
    });*/
    const navigate = useNavigate()
    const location = useLocation()
    const { idUsuario, idConductor } = location.state || {}

    const [conductor, setConductor] = useState(null);
    const [empresa, setEmpresa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const signatureRef = useRef(null);
    const [firmaConductor, setFirmaConductor] = useState(null);
    const obtenerFechaActual = () => {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0'); // meses desde 0
        const day = String(hoy.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const obtenerHoraActual = () => {
        const ahora = new Date();
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        return `${horas}:${minutos}`;
    };
    const [fechaEvaluacion, setFechaEvaluacion] = useState(obtenerFechaActual());
    const [horaEvaluacion, setHoraEvaluacion] = useState(obtenerHoraActual());
    const [enfermedades, setEnfermedades] = useState([
        { id: "1", nombre: "HIPERTENSIÓN", clave: "hipertension", tiene: '', noTiene: 'X', medicamentos: '' },
        { id: "2", nombre: "DIABETES", clave: "diabetes", tiene: '', noTiene: 'X', medicamentos: '' },
        { id: "3", nombre: "OTROS", clave: "otros", tiene: '', noTiene: 'X', medicamentos: '' }
    ]);
    const [mediciones, setMediciones] = useState({
        presion: { sis: '', dias: '' },
        presionNivel: { bajo: '', medio: 'X', alto: '' },
        pulso: '',
        pulsoNivel: { bajo: '', medio: 'X', alto: '' },
        peso: '',
        pesoNivel: { bajo: '', medio: 'X', alto: '' },
        estatura: '',
        estaturaNivel: { bajo: '', medio: 'X', alto: '' },
        glucosa: { pre: '', post: '' },
        glucosaNivel: { bajo: '', medio: 'X', alto: '' },
        grasa: '',
        grasaNivel: { bajo: '', medio: 'X', alto: '' },
        agua: '',
        aguaNivel: { bajo: '', medio: 'X', alto: '' },
        muscular: '',
        muscularNivel: { bajo: '', medio: 'X', alto: '' },
        osea: '',
        oseaNivel: { bajo: '', medio: 'X', alto: '' },
        imc: '',
        imcNivel: { bajo: '', medio: 'X', alto: '' },
    });
    const [observaciones, setObservaciones] = useState('');

    // Estado para el error de validación
    const [fileError, setFileError] = useState("")

    // Estado para los archivos seleccionados
    const [selectedFile, setSelectedFile] = useState(null)

    // Estado para el área de arrastrar y soltar
    const [isDragging, setIsDragging] = useState(false)

    // Referencia al input de archivos
    const fileInputRef = useRef(null)

    const [error, setError] = useState(null);

    /**
     * Efecto secundario para cargar los datos del conductor y la empresa.
     * @function
     * @param {number} idConductor - ID del conductor a buscar.
     * @param {number} idUsuario - ID del usuario.
     * @listens idConductor, idUsuario
     * @description Realiza una petición al servidor para obtener los datos del conductor y la empresa asociada.
     */
    useEffect(() => {
        console.log('idConductor actual:', idConductor);
        if (!idConductor) return;
        const fetchConductor = async () => {
            try {
                const response = await clienteHttp.get(`Cliente/buscarConductores/${idConductor}`);
                setConductor(response.data.conductor);
                setEmpresa(response.data.empresa);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setLoading(false);
            }
        };
        fetchConductor();
    }, [idUsuario, idConductor]); // Added idUsuario to dependencies

    if (loading) {
        return <div>Cargando datos...</div>;
    }

    /**
     * Valida el archivo seleccionado.
     * @function validateFile
     * @param {File} file - Archivo a validar.
     * @returns {boolean} `true` si el archivo es válido (PDF y menor a 10MB), `false` en caso contrario.
     */
    const validateFile = (file) => {
        if (!(file.type === "application/pdf" || file.type.startsWith("image/"))) {
            setFileError("Solo se permiten archivos PDF o imágenes");
            return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            setFileError("El archivo debe ser menor a 10MB");
            return false;
        }
        setFileError(""); // Resetear error si el archivo es válido
        return true;
    }

    /**
     * Separa los nombres de los apellidos.
     * @function separarNombreApellido
     * @param {String} nombreCompleto - nombre completo que se separará en nombres y apellidos.
     * @returns {nombre, apellido} 2 strins, 1 para los nombres y otro para los apellidos
     */

    const separarNombreApellido = (nombreCompleto) => {
        const partes = nombreCompleto.trim().split(/\s+/);

        if (partes.length === 0) {
            return { nombre: '', apellido: '' };
        }

        if (partes.length === 1) {
            return { nombre: partes[0], apellido: '' };
        }

        if (partes.length === 2) {
            return { nombre: partes[0], apellido: partes[1] };
        }

        if (partes.length === 3) {
            return {
                nombre: partes[0],
                apellido: partes.slice(1).join(' '), // dos apellidos
            };
        }

        // 4 o más palabras → últimos 2 son apellidos
        const apellido = partes.slice(-2).join(' ');
        const nombre = partes.slice(0, -2).join(' ');

        return { nombre, apellido };
    }

    /**
     * Maneja la selección de archivo desde el input.
     * @function handleFileSelect
     * @param {Event} event - Evento de cambio del input de archivo.
     */
    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (validateFile(file)) {
                setSelectedFile(file)
            } else {
                setSelectedFile(null)
                // Resetear el input de archivo para permitir seleccionar el mismo archivo después de un error
                e.target.value = ""
            }
        }
    }

    /**
     * Elimina el archivo seleccionado.
     * @function handleRemoveFile
     */
    const handleRemoveFile = () => {
        setSelectedFile(null)
        setFileError("")
    }

    /**
     * Abre el diálogo para seleccionar archivos.
     * @function handleChooseFiles
     */
    const handleChooseFiles = () => {
        fileInputRef.current.click()
    }

    /**
     * Maneja el inicio del arrastre de archivos.
     * @function handleDragEnter
     * @param {Event} event - Evento de arrastre.
     */
    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    /**
     * Maneja el final del arrastre de archivos.
     * @function handleDragLeave
     * @param {Event} event - Evento de arrastre.
     */
    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    /**
     * Maneja el arrastre sobre el área de drop.
     * @function handleDragOver
     * @param {Event} event - Evento de arrastre.
     */
    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isDragging) {
            setIsDragging(true)
        }
    }

    /**
     * Maneja el soltar un archivo en el área de drop.
     * @function handleDrop
     * @param {Event} event - Evento de soltar archivo.
     */
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0] // Solo tomamos el primer archivo
            if (validateFile(file)) {
                setSelectedFile(file)
            }
        }
    }

    /**
     * Maneja el cambio de estado para indicar si el conductor tiene una enfermedad.
     * @function handleTieneEnfermedad
     * @param {string} clave - Clave identificadora de la enfermedad.
     * @param {boolean} valor - Indica si el conductor tiene la enfermedad (true) o no (false).
     */
    const handleTieneEnfermedad = (clave, valor) => {
        setEnfermedades(prev =>
            prev.map(e =>
                e.clave === clave
                    ? {
                        ...e,
                        tiene: valor === true ? 'X' : '',
                        noTiene: valor === false ? 'X' : ''
                    }
                    : e
            )
        );
    };

    /**
     * Actualiza el valor de una medición específica.
     * @function updateMedicion
     * @param {string} categoria - Nombre de la categoría de la medición (ej: "presion", "pulso").
     * @param {string|null} campo - Campo específico dentro de la categoría (opcional, para objetos anidados).
     * @param {string|number} valor - Nuevo valor para la medición.
     */
    const updateMedicion = (categoria, campo, valor) => {
        setMediciones((prev) => {
            // Si la categoría es un objeto (anidado)
            if (typeof prev[categoria] === 'object' && campo) {
                return {
                    ...prev,
                    [categoria]: {
                        ...prev[categoria],
                        [campo]: valor
                    }
                };
            }
            // Si la categoría es simple (string o número)
            return {
                ...prev,
                [categoria]: valor
            };
        });
    };

    /**
     * Marca el nivel de una medición (bajo, medio, alto).
     * @function marcarNivel
     * @param {string} categoria - Nombre de la categoría de la medición.
     * @param {string} nivelSeleccionado - Nivel seleccionado ('bajo', 'medio', 'alto').
     */
    const marcarNivel = (categoria, nivelSeleccionado) => {
        setMediciones((prev) => ({
            ...prev,
            [`${categoria}Nivel`]: {
                bajo: nivelSeleccionado === 'bajo' ? 'X' : '',
                medio: nivelSeleccionado === 'medio' ? 'X' : '',
                alto: nivelSeleccionado === 'alto' ? 'X' : ''
            }
        }));
    };

    const validarCamposObligatorios = () => {
        // Campos obligatorios del conductor
        const camposConductor = [
            conductor?.nombre,
            conductor?.apellido,
            conductor?.fechaNacimiento,
            conductor?.email,
            conductor?.telefono,
            conductor?.run,
            conductor?.direccion,
            conductor?.comuna,
            conductor?.ciudad
        ];

        // Campos obligatorios de la empresa
        const camposEmpresa = [
            empresa?.nombreEmpresa,
            empresa?.rutEmpresa,
            empresa?.giro,
            empresa?.emailEmpresa,
            empresa?.telefonoEmpresa,
            empresa?.comunaEmpresa,
            empresa?.direccionEmpresa
        ];

        // Mediciones numéricas obligatorias
        const camposMediciones = [
            mediciones.presion.sis,
            mediciones.presion.dias,
            mediciones.pulso,
            mediciones.peso,
            mediciones.estatura,
            mediciones.grasa,
            mediciones.agua,
            mediciones.muscular,
            mediciones.osea,
            mediciones.imc
        ];

        const todosLosCampos = [...camposConductor, ...camposEmpresa, ...camposMediciones];

        // Verifica que ninguno esté vacío, null o undefined
        const hayCamposVacios = todosLosCampos.some(campo => !campo || campo.toString().trim() === '');

        return !hayCamposVacios;
    };

    const dataURLtoBlob = (dataurl) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /**
     * Maneja el envío del formulario.
     * @async
     * @function handleSubmit
     * @param {Event} e - Evento del formulario.
     * @description Prepara y envía los datos del formulario al servidor.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarCamposObligatorios()) {
            alert("Por favor completa todos los campos obligatorios antes de enviar.");
            return;
        }
        const enfermedadesMarcadas = {};
        enfermedades.forEach((e) => {
            enfermedadesMarcadas[`${e.clave[0]}Si`] = e.tiene;
            enfermedadesMarcadas[`${e.clave[0]}No`] = e.noTiene;
            enfermedadesMarcadas[`${e.clave}Medicamentos`] = e.medicamentos;
        });

        // Construir FormData
        const formData = new FormData();
        const blob = dataURLtoBlob(firmaConductor);
        formData.append('idCliente', idConductor || '');
        formData.append('idUsuario', idUsuario);
        formData.append('imagen', blob, 'firma.png');
        formData.append('parametros', JSON.stringify({
            nombre: conductor?.nombre || '',
            apellido: conductor?.apellido || '',
            fechaNacimiento: conductor?.fechaNacimiento || '',
            email: conductor?.email || '',
            telefono: conductor?.telefono || '',
            run: conductor?.run || '',
            direccion: conductor?.direccion || '',
            comuna: conductor?.comuna || '',
            ciudad: conductor?.ciudad || '',
            nombreEmpresa: empresa?.nombreEmpresa || '',
            rutEmpresa: empresa?.rutEmpresa || '',
            giro: empresa?.giro || '',
            direccionEmpresa: empresa?.direccionEmpresa || '',
            telefonoEmpresa: empresa?.telefonoEmpresa || '',
            emailEmpresa: empresa?.emailEmpresa || '',
            comunaEmpresa: empresa?.comunaEmpresa || '',
            fechaEvaluacion: fechaEvaluacion,
            horaEvaluacion: horaEvaluacion,
            ...enfermedadesMarcadas,
            preSis: mediciones.presion.sis,
            preDias: mediciones.presion.dias,
            preAB: mediciones.presionNivel.bajo,
            preAN: mediciones.presionNivel.medio,
            preAA: mediciones.presionNivel.alto,
            pulso: mediciones.pulso,
            pulsB: mediciones.pulsoNivel.bajo,
            pulsN: mediciones.pulsoNivel.medio,
            pulsA: mediciones.pulsoNivel.alto,
            peso: mediciones.peso,
            pesoB: mediciones.pesoNivel.bajo,
            pesoN: mediciones.pesoNivel.medio,
            pesoA: mediciones.pesoNivel.alto,
            estatura: mediciones.estatura,
            estaB: mediciones.estaturaNivel.bajo,
            estaN: mediciones.estaturaNivel.medio,
            estaA: mediciones.estaturaNivel.alto,
            gPre: mediciones.glucosa.pre,
            gPost: mediciones.glucosa.post,
            glucB: mediciones.glucosaNivel.bajo,
            glucN: mediciones.glucosaNivel.medio,
            glucA: mediciones.glucosaNivel.alto,
            grasa: mediciones.grasa,
            grasB: mediciones.grasaNivel.bajo,
            grasN: mediciones.grasaNivel.medio,
            gras_A: mediciones.grasaNivel.alto,
            agua: mediciones.agua,
            aguaB: mediciones.aguaNivel.bajo,
            aguaN: mediciones.aguaNivel.medio,
            aguaA: mediciones.aguaNivel.alto,
            masaMuscular: mediciones.muscular,
            maMuB: mediciones.muscularNivel.bajo,
            maMuN: mediciones.muscularNivel.medio,
            maMuA: mediciones.muscularNivel.alto,
            masaOsea: mediciones.osea,
            maOsB: mediciones.oseaNivel.bajo,
            maOsN: mediciones.oseaNivel.medio,
            maOsA: mediciones.oseaNivel.alto,
            imc: mediciones.imc,
            imcB: mediciones.imcNivel.bajo,
            imcN: mediciones.imcNivel.medio,
            imcA: mediciones.imcNivel.alto,
            observaciones: observaciones
        }));

        setIsSubmitting(true);

        try {
            const response = await formularioHttp.post('Formulario/generate/medic', formData, selectedFile);

            if (response.status === 200) {
                alert('Datos guardados exitosamente');
                setTimeout(() => {
                    navigate('/ViewDriverMedic');
                }, 500);
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            alert('Error al guardar los datos. Por favor, intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
            <section className='mb-8 w-full'>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
                    Formulario Medico de Evaluacion
                </h2>
            </section>







            {/* Antecedentes del evaluado */}
            <section className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Antecedentes del evaluado</h3>
                <div className="grid gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre Completo
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={conductor?.nombre + ' ' + conductor?.apellido || ''}
                                onChange={(e) => {
                                    const { nombre, apellido } = separarNombreApellido(e.target.value);
                                    setConductor({ ...conductor, nombre, apellido });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
                                RUT
                                <input
                                    type="text"
                                    name="rut"
                                    id="rut"
                                    value={conductor?.run || ''}
                                    onChange={(e) => setConductor({ ...conductor, run: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de nacimiento
                                <input
                                    type="date"
                                    name="fecha_nacimiento"
                                    id="fecha_nacimiento"
                                    value={conductor?.fechaNacimiento || ''}
                                    onChange={(e) => setConductor({ ...conductor, fechaNacimiento: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                                <input
                                    type="tel"
                                    name="telefono"
                                    id="telefono"
                                    value={conductor?.telefono || ''}
                                    onChange={(e) => setConductor({ ...conductor, telefono: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={conductor?.email || ''}
                                    onChange={(e) => setConductor({ ...conductor, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección
                            <input
                                type="text"
                                name="direccion"
                                id="direccion"
                                value={conductor?.direccion || ''}
                                onChange={(e) => setConductor({ ...conductor, direccion: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 mb-1">
                                Comuna
                                <input
                                    type="text"
                                    name="comuna"
                                    id="comuna"
                                    value={conductor?.comuna || ''}
                                    placeholder="Ingrese la comuna"
                                    onChange={(e) => setConductor({ ...conductor, comuna: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                                Ciudad
                                <input
                                    type="text"
                                    name="ciudad"
                                    id="ciudad"
                                    value={conductor?.ciudad || ''}
                                    placeholder="Ingrese la ciudad"
                                    onChange={(e) => setConductor({ ...conductor, ciudad: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Antecedentes de la empresa */}
            <section className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Antecedentes de la empresa</h3>
                <div className="grid gap-4">
                    <div>
                        <label htmlFor="empresa_nombre" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de la empresa
                            <input
                                type="text"
                                name="empresa_nombre"
                                id="empresa_nombre"
                                value={empresa?.nombreEmpresa || ''}
                                onChange={(e) => setEmpresa({ ...empresa, nombreEmpresa: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="empresa_rut" className="block text-sm font-medium text-gray-700 mb-1">
                            RUT de la empresa
                            <input
                                type="text"
                                name="empresa_rut"
                                id="empresa_rut"
                                value={empresa?.rutEmpresa || ''}
                                onChange={(e) => setEmpresa({ ...empresa, rutEmpresa: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="empresa_giro" className="block text-sm font-medium text-gray-700 mb-1">
                                Giro de la empresa
                                <input
                                    type="text"
                                    name="empresa_giro"
                                    id="empresa_giro"
                                    value={empresa?.giro || ''}
                                    onChange={(e) => setEmpresa({ ...empresa, giro: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="empresa_email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email de la empresa
                                <input
                                    type="email"
                                    name="empresa_email"
                                    id="empresa_email"
                                    value={empresa?.emailEmpresa || ''}
                                    onChange={(e) => setEmpresa({ ...empresa, emailEmpresa: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="empresa_telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono de la empresa
                                <input
                                    type="tel"
                                    name="empresa_telefono"
                                    id="empresa_telefono"
                                    value={empresa?.telefonoEmpresa || ''}
                                    onChange={(e) => setEmpresa({ ...empresa, telefonoEmpresa: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                        <div>
                            <label htmlFor="empresa_comuna" className="block text-sm font-medium text-gray-700 mb-1">
                                Comuna de la empresa
                                <input
                                    type="text"
                                    name="empresa_comuna"
                                    id="empresa_comuna"
                                    value={empresa?.comunaEmpresa || ''}
                                    onChange={(e) => setEmpresa({ ...empresa, comunaEmpresa: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="empresa_direccion" className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección de la empresa
                            <input
                                type="text"
                                name="empresa_direccion"
                                id="empresa_direccion"
                                value={empresa?.direccionEmpresa || ''}
                                onChange={(e) => setEmpresa({ ...empresa, direccionEmpresa: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </label>
                    </div>
                </div>
            </section>

            {/* Registro de salud */}
            <section className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Registro de salud</h3>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label htmlFor="fecha_evaluacion" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de evaluación
                            </label>
                            <input
                                type="date"
                                name="fecha_evaluacion"
                                id="fecha_evaluacion"
                                value={fechaEvaluacion}
                                onChange={(e) => setFechaEvaluacion(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="hora_evaluacion" className="block text-sm font-medium text-gray-700 mb-1">
                                Hora de evaluación
                            </label>
                            <input
                                type="time"
                                name="hora_evaluacion"
                                id="hora_evaluacion"
                                value={horaEvaluacion}
                                onChange={(e) => setHoraEvaluacion(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-400">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                                        Enfermedad
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                                        SI
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                                        NO
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                                        Medicamento
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {enfermedades.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap border border-gray-400">
                                            {item.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-400">
                                            <input
                                                type="radio"
                                                name={`tieneEnfermedad_${item.id}`}
                                                checked={item.tiene === 'X'}
                                                onChange={() => handleTieneEnfermedad(item.clave, true)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center border border-gray-400">
                                            <input
                                                type="radio"
                                                name={`noTieneEnfermedad_${item.id}`}
                                                checked={item.tiene === ''}
                                                onChange={() => handleTieneEnfermedad(item.clave, false)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border border-gray-400">
                                            <input
                                                type="text"
                                                value={item.medicamento}
                                                onChange={(e) =>
                                                    setEnfermedades((prev) =>
                                                        prev.map((enf) =>
                                                            enf.clave === item.clave
                                                                ? { ...enf, medicamentos: e.target.value }
                                                                : enf
                                                        )
                                                    )
                                                }
                                                placeholder="Ingrese el medicamento"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <section className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-400">
                        <thead className="bg-gray-50">
                            <tr>
                                <th rowSpan={2} className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">&nbsp;</th>
                                <th colSpan={2} className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center">VALOR</th>
                                <th rowSpan={2} className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">BAJO</th>
                                <th rowSpan={2} className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">NORMAL</th>
                                <th rowSpan={2} className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ALTO</th>
                            </tr>
                            <tr>
                                <th className="px-2 py-1 text-xs font-medium text-gray-700 border border-gray-400 text-center">Sistólica</th>
                                <th className="px-2 py-1 text-xs font-medium text-gray-700 border border-gray-400 text-center">Diastólica</th>
                            </tr>
                        </thead>
                        <tbody className=" divide-y divide-gray-200">
                            {/* Presión Arterial */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Presión Arterial</td>
                                <td className="px-2 py-2 border border-gray-400"><input type="number" name="presion_sis" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.presion.sis} onChange={(e) => updateMedicion('presion', 'sis', e.target.value)} placeholder="Sistólica" /></td>
                                <td className="px-2 py-2 border border-gray-400"><input type="number" name="presion_dias" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.presion.dias} onChange={(e) => updateMedicion('presion', 'dias', e.target.value)} placeholder="Diastólica" /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="presion_nivel" checked={mediciones.presionNivel.bajo === 'X'} onChange={() => marcarNivel('presion', 'bajo')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="presion_nivel" checked={mediciones.presionNivel.medio === 'X'} onChange={() => marcarNivel('presion', 'medio')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="presion_nivel" checked={mediciones.presionNivel.alto === 'X'} onChange={() => marcarNivel('presion', 'alto')} /></td>
                            </tr>
                            {/* Pulso */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Pulso</td>
                                <td colSpan={2} className="px-2 py-2 border border-gray-400"><input type="number" name="pulso" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.pulso} onChange={(e) => updateMedicion('pulso', null, e.target.value)} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="pulso_nivel" checked={mediciones.pulsoNivel.bajo === 'X'} onChange={() => marcarNivel('pulso', 'bajo')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="pulso_nivel" checked={mediciones.pulsoNivel.medio === 'X'} onChange={() => marcarNivel('pulso', 'medio')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="pulso_nivel" checked={mediciones.pulsoNivel.alto === 'X'} onChange={() => marcarNivel('pulso', 'alto')} /></td>
                            </tr>
                            {/* Peso */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Peso</td>
                                <td colSpan={2} className="px-2 py-2 border border-gray-400"><input type="number" name="peso" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.peso} onChange={(e) => updateMedicion('peso', null, e.target.value)} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="peso_nivel" checked={mediciones.pesoNivel.bajo === 'X'} onChange={() => marcarNivel('peso', 'bajo')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="peso_nivel" checked={mediciones.pesoNivel.medio === 'X'} onChange={() => marcarNivel('peso', 'medio')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="peso_nivel" checked={mediciones.pesoNivel.alto === 'X'} onChange={() => marcarNivel('peso', 'alto')} /></td>
                            </tr>
                            {/* Estatura */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Estatura</td>
                                <td colSpan={2} className="px-2 py-2 border border-gray-400"><input type="number" name="estatura" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.estatura} onChange={(e) => updateMedicion('estatura', null, e.target.value)} /></td>
                            </tr>
                            {/* Glucosa en sangre */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Glucosa en sangre</td>
                                <td className="px-2 py-2 border border-gray-400"><input type="number" name="glucosa_pre" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.glucosa.pre} onChange={(e) => updateMedicion('glucosa', 'pre', e.target.value)} placeholder="Preprandial" /></td>
                                <td className="px-2 py-2 border border-gray-400"><input type="number" name="glucosa_pos" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.glucosa.post} onChange={(e) => updateMedicion('glucosa', 'post', e.target.value)} placeholder="Postprandial" /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="glucosa_nivel" checked={mediciones.glucosaNivel.bajo === 'X'} onChange={() => marcarNivel('glucosa', 'bajo')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="glucosa_nivel" checked={mediciones.glucosaNivel.medio === 'X'} onChange={() => marcarNivel('glucosa', 'medio')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="glucosa_nivel" checked={mediciones.glucosaNivel.alto === 'X'} onChange={() => marcarNivel('glucosa', 'alto')} /></td>
                            </tr>
                            {/* Grasa corporal */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Grasa corporal</td>
                                <td colSpan={2} className="px-2 py-2 border border-gray-400"><input type="number" name="grasa_corporal" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.grasa} onChange={(e) => updateMedicion('grasa', null, e.target.value)} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grasa_nivel" checked={mediciones.grasaNivel.bajo === 'X'} onChange={() => marcarNivel('grasa', 'bajo')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grasa_nivel" checked={mediciones.grasaNivel.medio === 'X'} onChange={() => marcarNivel('grasa', 'medio')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grasa_nivel" checked={mediciones.grasaNivel.alto === 'X'} onChange={() => marcarNivel('grasa', 'alto')} /></td>
                            </tr>
                            {/* Agua en cuerpo */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Agua en cuerpo</td>
                                <td colSpan={2} className="px-2 py-2 border border-gray-400"><input type="number" name="agua_cuerpo" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.agua} onChange={(e) => updateMedicion('agua', null, e.target.value)} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="agua_nivel" checked={mediciones.aguaNivel.bajo === 'X'} onChange={() => marcarNivel('agua', 'bajo')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="agua_nivel" checked={mediciones.aguaNivel.medio === 'X'} onChange={() => marcarNivel('agua', 'medio')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="agua_nivel" checked={mediciones.aguaNivel.alto === 'X'} onChange={() => marcarNivel('agua', 'alto')} /></td>
                            </tr>
                            {/* Masa muscular */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Masa muscular</td>
                                <td colSpan={2} className="px-2 py-2 border border-gray-400"><input type="number" name="masa_muscular" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.muscular} onChange={(e) => updateMedicion('muscular', null, e.target.value)} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="muscular_nivel" checked={mediciones.muscularNivel.bajo === 'X'} onChange={() => marcarNivel('muscular', 'bajo')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="muscular_nivel" checked={mediciones.muscularNivel.medio === 'X'} onChange={() => marcarNivel('muscular', 'medio')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="muscular_nivel" checked={mediciones.muscularNivel.alto === 'X'} onChange={() => marcarNivel('muscular', 'alto')} /></td>
                            </tr>
                            {/* Masa ósea */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Masa ósea</td>
                                <td colSpan={2} className="px-2 py-2 border border-gray-400"><input type="number" name="masa_osea" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.osea} onChange={(e) => updateMedicion('osea', null, e.target.value)} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="osea_nivel" checked={mediciones.oseaNivel.bajo === 'X'} onChange={() => marcarNivel('osea', 'bajo')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="osea_nivel" checked={mediciones.oseaNivel.medio === 'X'} onChange={() => marcarNivel('osea', 'medio')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="osea_nivel" checked={mediciones.oseaNivel.alto === 'X'} onChange={() => marcarNivel('osea', 'alto')} /></td>
                            </tr>
                            {/* Índice masa corporal */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Índice masa corporal</td>
                                <td colSpan={2} className="px-2 py-2 border border-gray-400"><input type="number" name="imc" className="w-full px-2 py-1 border border-gray-300 rounded-md" value={mediciones.imc} onChange={(e) => updateMedicion('imc', null, e.target.value)} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="imc_nivel" checked={mediciones.imcNivel.bajo === 'X'} onChange={() => marcarNivel('imc', 'bajo')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="imc_nivel" checked={mediciones.imcNivel.medio === 'X'} onChange={() => marcarNivel('imc', 'medio')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="imc_nivel" checked={mediciones.imcNivel.alto === 'X'} onChange={() => marcarNivel('imc', 'alto')} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Observaciones */}
                <div className="mt-6">
                    <div>
                        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones:</label>
                        <textarea name="observaciones" id="observaciones" rows={4} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">

                        </textarea>
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Firma del conductor
                        </label>

                        <div className="border border-gray-300 rounded-md p-2">
                            <SignaturePad
                                ref={signatureRef}
                                canvasProps={{ className: 'w-full h-40 border border-gray-200 rounded' }}
                            />
                        </div>

                        <div className="mt-2 flex space-x-2">
                            <button
                                type="button"
                                onClick={() => signatureRef.current.clear()}
                                className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                            >
                                Limpiar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!signatureRef.current.isEmpty()) {
                                        const dataURL = signatureRef.current.toDataURL();
                                        setFirmaConductor(dataURL); // aquí puedes subir o mostrar la firma
                                    }
                                }}
                                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Guardar firma
                            </button>
                        </div>

                        {firmaConductor && (
                            <img src={firmaConductor} alt="Firma del conductor" className="mt-4 border" />
                        )}
                    </div>
                </div>
                {/* Botón enviar */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={isSubmitting}
                        className={`${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white font-bold py-2 px-6 rounded-md shadow transition-colors`}
                    >
                        {isSubmitting ? 'Cargando...' : 'Enviar Datos'}
                    </button>
                </div>
            </section>
        </div>
    );
}