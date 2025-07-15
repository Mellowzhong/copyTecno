import { useState, useEffect, useRef } from 'react';
import clienteHttp from '../../http-common/cliente-http-common';
import formularioHttp from '../../http-common/formulario-http-common';
import { storage } from '../../storage';
import { formatearFechaLarga } from '../../Utils/formatearFecha';
import { useNavigate, useLocation } from "react-router-dom"
import SignaturePad from 'react-signature-canvas';

/**
 * Componente funcional para el formulario de evaluación psicológica de conductores.
 * @module psychologistForm
 * @description Permite registrar y enviar una evaluación psicológica completa de un conductor, incluyendo antecedentes, datos de la empresa, gráficos cuantitativos y conclusiones.
 * @returns {JSX.Element} El formulario de evaluación psicológica.
 */
export default function PsychologistForm() {
    const navigate = useNavigate()
    const location = useLocation()
    const { idUsuario, idConductor } = location.state || {}
    const signatureRef = useRef(null);
    const [firmaConductor, setFirmaConductor] = useState(null);
    const [conductor, setConductor] = useState(null);
    const [genero, setGenero] = useState('');
    const [empresa, setEmpresa] = useState(null);
    const [testAplicados, setTestAplicados] = useState("Cuestionario de Pittsburg de Calidad de sueño, Test de Persona bajo la lluvia, Test de Luscher y Entrevista personal");
    const obtenerFechaActual = () => {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0'); // meses desde 0
        const day = String(hoy.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [fechaEvaluacion, setFechaEvaluacion] = useState(obtenerFechaActual());
    const [evaluador, setEvaluador] = useState(''); //cambiar para obtener desde back y auth
    const [presActComp, setPresActComp] = useState('');
    const [opcionesEvaluacion, setOpcionesEvaluacion] = useState({
        nivelIntelectualEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        capacidadEjecutoriaEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        estiloTrabajoEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        honestidadConfiabilidadEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        situacionesImprevistasEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        figurasAutoridadEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        gradoEstabilidadEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        toleranciaEstresEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        conceptoMismoEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        autonomiaIniciativaEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        tipoMotivacionEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        capacidadEstablecerEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        empatiaEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        capacidadPersuacionEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' },
        gradoAdecuacionEval: { deficiente: '', regular: 'X', adecuado: '', optimo: '' }
    })
    const [areaIntelectual, setAreaIntelectual] = useState('');
    const [areaLaboral, setAreaLaboral] = useState('');
    const [areaSocioAfectiva, setAreaSocioAfectiva] = useState('');
    const [fortalezas, setFortalezas] = useState('');
    const [debilidades, setDebilidades] = useState('');
    const [experiencia, setExperiencia] = useState('');
    const [conclusiones, setConclusiones] = useState('');
    const [nivelSomnolencia, setNivelSomnolencia] = useState('');
    const [requiereSugerencias, setRequiereSugerencias] = useState(false);
    const [sugerencias, setSugerencias] = useState('');
    const [estadoEvaluacion, setEstadoEvaluacion] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(true);

    const testAplicadosRef = useRef(null);
    const presentacionActitudRef = useRef(null);
    const areaIntelectualRef = useRef(null);
    const areaLaboralRef = useRef(null);
    const areaSocioAfectivaRef = useRef(null);
    const fortalezasRef = useRef(null);
    const debilidadesRef = useRef(null);
    const experienciaRef = useRef(null);
    const conclusionesRef = useRef(null);


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
     * Efecto para cargar los datos del conductor y la empresa asociada.
     * @function
     * @listens idConductor, idUsuario
     * @description Realiza una petición al servidor para obtener los datos del conductor y la empresa.
     */
    useEffect(() => {
        const fetchConductor = async () => {
            try {
                const response = await clienteHttp.get(`Cliente/buscarConductores/${idConductor}`);
                const conductorData = response.data.conductor;
                const empresaData = response.data.empresa;
                // Calcular edad
                const fechaNacimiento = new Date(conductorData.fechaNacimiento);
                const hoy = new Date();
                let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
                const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();
                // Ajustar si aún no ha cumplido años este año
                if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                    edad--;
                }
                // Puedes agregar la edad al objeto o guardarla en otro estado si lo prefieres
                conductorData.edad = edad;
                setConductor(conductorData);
                setEmpresa(empresaData);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setLoading(false);
            }
        };
        fetchConductor();
    }, [idConductor, idUsuario]); // Added idUsuario to dependencies

    if (loading) {
        return <div>Cargando datos...</div>;
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
     * Maneja el envío del formulario de evaluación psicológica.
     * @async
     * @function handleSubmit
     * @param {Event} e - Evento de envío del formulario.
     * @description Prepara y envía los datos del formulario al servidor.
     */
    const handleInput = (ref) => {
        const textarea = ref.current;
        if (textarea) {
            textarea.style.height = "auto"; // Reinicia altura
            textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta a contenido
        }
    };

    const marcarEvaluacion = (categoria, opcionSeleccionada) => {
        setOpcionesEvaluacion((prev) => ({
            ...prev,
            [`${categoria}Eval`]: {
                deficiente: opcionSeleccionada === 'deficiente' ? 'X' : '',
                regular: opcionSeleccionada === 'regular' ? 'X' : '',
                adecuado: opcionSeleccionada === 'adecuado' ? 'X' : '',
                optimo: opcionSeleccionada === 'optimo' ? 'X' : ''
            }
        }));
    };

    const obtenerPronombreYCordialidad = (genero) => {
        let pronombre = '';
        let cordialidad = '';

        switch (genero.toLowerCase()) {
            case 'masculino':
                pronombre = 'El';
                cordialidad = 'Sr.';
                break;
            case 'femenino':
                pronombre = 'La';
                cordialidad = 'Sra.';
                break;
            case 'otro':
                pronombre = 'La';
                cordialidad = 'persona evaluada de apellido';
                break;
            default:
                pronombre = '';
                cordialidad = '';
        }

        return { pronombre, cordialidad };
    };

    const handleCheckboxChange = (e) => {
        setRequiereSugerencias(e.target.checked);
        if (!e.target.checked) {
            setSugerencias(''); // Limpiar si se desmarca
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { pronombre, cordialidad } = obtenerPronombreYCordialidad(genero);
        try {
            // Preparar los datos en el formato simplificado
            // Construir FormData
            const formData = new FormData();
            const blob = dataURLtoBlob(firmaConductor);
            formData.append('imagen', blob, 'firma.png'); // Cambia 'firma.png' por el nombre que desees
            formData.append('idUsuario', idUsuario);
            formData.append('imagen', blob, 'firma.png');
            formData.append('idCliente', idConductor || ''); //Modificar para cuando se haga la entrada dinamica con los conductores de hoy
            formData.append('parametros', JSON.stringify({
                nombre: conductor?.nombre || '',
                apellido: conductor?.apellido || '',
                fechaNacimiento: formatearFechaLarga(conductor.fechaNacimiento),
                edad: conductor?.edad + ' años' || '',
                run: conductor?.run || '',
                telefono: conductor?.telefono || '',
                email: conductor?.email || '',
                direccion: conductor?.direccion || '',
                testAplicados: testAplicados,
                fechaEvaluacion: formatearFechaLarga(fechaEvaluacion),
                nombreEmpresa: empresa?.nombreEmpresa || '',
                evaluador: evaluador,
                pronombre: pronombre,
                cordialidad: cordialidad,
                primerApellido: conductor.apellido.split(' ')[0],
                presentacionActitudComportamiento: presActComp,
                niDef: opcionesEvaluacion.nivelIntelectualEval.deficiente,
                niReg: opcionesEvaluacion.nivelIntelectualEval.regular,
                niAde: opcionesEvaluacion.nivelIntelectualEval.adecuado,
                niOpt: opcionesEvaluacion.nivelIntelectualEval.optimo,
                ceDef: opcionesEvaluacion.capacidadEjecutoriaEval.deficiente,
                ceReg: opcionesEvaluacion.capacidadEjecutoriaEval.regular,
                ceAde: opcionesEvaluacion.capacidadEjecutoriaEval.adecuado,
                ceOpt: opcionesEvaluacion.capacidadEjecutoriaEval.optimo,
                etDef: opcionesEvaluacion.estiloTrabajoEval.deficiente,
                etReg: opcionesEvaluacion.estiloTrabajoEval.regular,
                etAde: opcionesEvaluacion.estiloTrabajoEval.adecuado,
                etOpt: opcionesEvaluacion.estiloTrabajoEval.optimo,
                hcDef: opcionesEvaluacion.honestidadConfiabilidadEval.deficiente,
                hcReg: opcionesEvaluacion.honestidadConfiabilidadEval.regular,
                hcAde: opcionesEvaluacion.honestidadConfiabilidadEval.adecuado,
                hcOpt: opcionesEvaluacion.honestidadConfiabilidadEval.optimo,
                siDef: opcionesEvaluacion.situacionesImprevistasEval.deficiente,
                siReg: opcionesEvaluacion.situacionesImprevistasEval.regular,
                siAde: opcionesEvaluacion.situacionesImprevistasEval.adecuado,
                siOpt: opcionesEvaluacion.situacionesImprevistasEval.optimo,
                fiDef: opcionesEvaluacion.figurasAutoridadEval.deficiente,
                fiReg: opcionesEvaluacion.figurasAutoridadEval.regular,
                fiAde: opcionesEvaluacion.figurasAutoridadEval.adecuado,
                fiOpt: opcionesEvaluacion.figurasAutoridadEval.optimo,
                geDef: opcionesEvaluacion.gradoEstabilidadEval.deficiente,
                geReg: opcionesEvaluacion.gradoEstabilidadEval.regular,
                geAde: opcionesEvaluacion.gradoEstabilidadEval.adecuado,
                geOpt: opcionesEvaluacion.gradoEstabilidadEval.optimo,
                teDef: opcionesEvaluacion.toleranciaEstresEval.deficiente,
                teReg: opcionesEvaluacion.toleranciaEstresEval.regular,
                teAde: opcionesEvaluacion.toleranciaEstresEval.adecuado,
                teOpt: opcionesEvaluacion.toleranciaEstresEval.optimo,
                cmDef: opcionesEvaluacion.conceptoMismoEval.deficiente,
                cmReg: opcionesEvaluacion.conceptoMismoEval.regular,
                cmAde: opcionesEvaluacion.conceptoMismoEval.adecuado,
                cmOpt: opcionesEvaluacion.conceptoMismoEval.optimo,
                aiDef: opcionesEvaluacion.autonomiaIniciativaEval.deficiente,
                aiReg: opcionesEvaluacion.autonomiaIniciativaEval.regular,
                aiAde: opcionesEvaluacion.autonomiaIniciativaEval.adecuado,
                aiOpt: opcionesEvaluacion.autonomiaIniciativaEval.optimo,
                tmDef: opcionesEvaluacion.tipoMotivacionEval.deficiente,
                tmReg: opcionesEvaluacion.tipoMotivacionEval.regular,
                tmAde: opcionesEvaluacion.tipoMotivacionEval.adecuado,
                tmOpt: opcionesEvaluacion.tipoMotivacionEval.optimo,
                ccDef: opcionesEvaluacion.capacidadEstablecerEval.deficiente,
                ccReg: opcionesEvaluacion.capacidadEstablecerEval.regular,
                ccAde: opcionesEvaluacion.capacidadEstablecerEval.adecuado,
                ccOpt: opcionesEvaluacion.capacidadEstablecerEval.optimo,
                emDef: opcionesEvaluacion.empatiaEval.deficiente,
                emReg: opcionesEvaluacion.empatiaEval.regular,
                emAde: opcionesEvaluacion.empatiaEval.adecuado,
                emOpt: opcionesEvaluacion.empatiaEval.optimo,
                cpDef: opcionesEvaluacion.capacidadPersuacionEval.deficiente,
                cpReg: opcionesEvaluacion.capacidadPersuacionEval.regular,
                cpAde: opcionesEvaluacion.capacidadPersuacionEval.adecuado,
                cpOpt: opcionesEvaluacion.capacidadPersuacionEval.optimo,
                gaDef: opcionesEvaluacion.gradoAdecuacionEval.deficiente,
                gaReg: opcionesEvaluacion.gradoAdecuacionEval.regular,
                gaAde: opcionesEvaluacion.gradoAdecuacionEval.adecuado,
                gaOpt: opcionesEvaluacion.gradoAdecuacionEval.optimo,
                areaIntelectual: areaIntelectual,
                areaLaboral: areaLaboral,
                areaSocioAfectiva: areaSocioAfectiva,
                fortalezas: fortalezas,
                debilidades: debilidades,
                experiencia: experiencia,
                conclusiones: conclusiones,
                nivelSomnolencia: nivelSomnolencia,
                sugerencias: "Sugerencias: " + sugerencias,
                resultado: estadoEvaluacion,
                observaciones: observaciones
            }));

            // Enviar los datos al backend
            // Enviar los datos al backend
            console.log('Datos a enviar:', Object.fromEntries(formData.entries()));
            const response = await formularioHttp.post('Formulario/generate/psyco', formData, selectedFile);

            if (response.status === 200) {
                alert('Datos guardados exitosamente');
                setTimeout(() => {
                    navigate('/ViewDriverPsychologist'); // Cambia esta ruta según lo que necesites
                }, 500);
            }
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            alert('Error al guardar los datos. Por favor, intente nuevamente.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
            <section className='mb-8 w-full'>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
                    Evaluación Psicolaboral
                </h2>
            </section>
            {/* Antecedentes del evaluado */}
            <section className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">1. DATOS PERSONALES</h3>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo
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
                    <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-1">
                        Edad
                        <input
                            type="text"
                            name="edad"
                            id="edad"
                            value={conductor?.edad ? `${conductor.edad} años` : ''}
                            onChange={(e) => setConductor({ ...conductor, edad: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">Género:</label>
                    <select name="genero" id="genero" value={genero} onChange={(e) => setGenero(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                        <option value="" disabled hidden>Seleccione una opción</option>
                        <option value="femenino">femenino</option>
                        <option value="masculino">masculino</option>
                        <option value="otro">otro</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
                        Cédula de identidad
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
                        Correo electrónico
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
                <div>
                    <label htmlFor="test_aplicados" className="block text-sm font-medium text-gray-700 mb-1">
                        Test aplicados
                        <input
                            type="text"
                            ref={testAplicadosRef}
                            name="test_aplicados"
                            id="test_aplicados"
                            value={testAplicados}
                            rows={1}
                            onInput={handleInput(testAplicadosRef)}
                            onChange={(e) => setTestAplicados(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="fecha_evaluacion" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de evaluación
                        <input
                            type="date"
                            name="fecha_evaluacion"
                            id="fecha_evaluacion"
                            value={fechaEvaluacion}
                            onChange={(e) => setFechaEvaluacion(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="empresa_nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa
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
                    <label htmlFor="evaluador" className="block text-sm font-medium text-gray-700 mb-1">
                        Profesional evaluador
                        <input
                            type="text"
                            name="evaluador"
                            id="evaluador"
                            value={evaluador}
                            onChange={(e) => setEvaluador(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="presentacion_actitud_comportamiento" className="block text-sm font-medium text-gray-700 mb-1">
                        Presentación, actitud y comportamiento general:
                        <input
                            type="text"
                            ref={presentacionActitudRef}
                            name="presentacion_actitud_comportamiento"
                            id="presentacion_actitud_comportamiento"
                            value={presActComp}
                            rows={1}
                            onInput={handleInput(presentacionActitudRef)}
                            onChange={(e) => setPresActComp(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </label>
                </div>
            </section>
            {/* Grafico Cuantitativo */}
            <section className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">2. GRÁFICO CUANTITATIVO</h3>
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed divide-y divide-gray-200 border border-gray-400">
                        <thead className="bg-gray-50">
                            <tr>
                                <th rowSpan={2}
                                    className="w-[50%] px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ÁREA
                                    INTELECTUAL
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">DEFICIENTE
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">REGULAR
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ADECUADO
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ÓPTIMO
                                </th>
                            </tr>
                        </thead>
                        <tbody className=" divide-y divide-gray-200">
                            {/* Nivel Intelectual */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Nivel Intelectual</td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="nivel_intelectual" checked={opcionesEvaluacion.nivelIntelectualEval.deficiente === 'X'} onChange={() => marcarEvaluacion('nivelIntelectual', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="nivel_intelectual" checked={opcionesEvaluacion.nivelIntelectualEval.regular === 'X'} onChange={() => marcarEvaluacion('nivelIntelectual', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="nivel_intelectual" checked={opcionesEvaluacion.nivelIntelectualEval.adecuado === 'X'} onChange={() => marcarEvaluacion('nivelIntelectual', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="nivel_intelectual" checked={opcionesEvaluacion.nivelIntelectualEval.optimo === 'X'} onChange={() => marcarEvaluacion('nivelIntelectual', 'optimo')} /></td>
                            </tr>
                            {/* Capacidad ejecutoria de planes y metas */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Capacidad ejecutoria de planes y metas</td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_ejecutoria" checked={opcionesEvaluacion.capacidadEjecutoriaEval.deficiente === 'X'} onChange={() => marcarEvaluacion('capacidadEjecutoria', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_ejecutoria" checked={opcionesEvaluacion.capacidadEjecutoriaEval.regular === 'X'} onChange={() => marcarEvaluacion('capacidadEjecutoria', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_ejecutoria" checked={opcionesEvaluacion.capacidadEjecutoriaEval.adecuado === 'X'} onChange={() => marcarEvaluacion('capacidadEjecutoria', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_ejecutoria" checked={opcionesEvaluacion.capacidadEjecutoriaEval.optimo === 'X'} onChange={() => marcarEvaluacion('capacidadEjecutoria', 'optimo')} /></td>
                            </tr>
                            {/* Estilo de Trabajo */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Estilo de trabajo</td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="estilo_trabajo" checked={opcionesEvaluacion.estiloTrabajoEval.deficiente === 'X'} onChange={() => marcarEvaluacion('estiloTrabajo', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="estilo_trabajo" checked={opcionesEvaluacion.estiloTrabajoEval.regular === 'X'} onChange={() => marcarEvaluacion('estiloTrabajo', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="estilo_trabajo" checked={opcionesEvaluacion.estiloTrabajoEval.adecuado === 'X'} onChange={() => marcarEvaluacion('estiloTrabajo', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="estilo_trabajo" checked={opcionesEvaluacion.estiloTrabajoEval.optimo === 'X'} onChange={() => marcarEvaluacion('estiloTrabajo', 'optimo')} /></td>
                            </tr>
                            {/* Honestidad y Confiabilidad */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Honestidad y Confiabilidad</td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="honestidad_confiabilidad" checked={opcionesEvaluacion.honestidadConfiabilidadEval.deficiente === 'X'} onChange={() => marcarEvaluacion('honestidadConfiabilidad', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="honestidad_confiabilidad" checked={opcionesEvaluacion.honestidadConfiabilidadEval.regular === 'X'} onChange={() => marcarEvaluacion('honestidadConfiabilidad', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="honestidad_confiabilidad" checked={opcionesEvaluacion.honestidadConfiabilidadEval.adecuado === 'X'} onChange={() => marcarEvaluacion('honestidadConfiabilidad', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="honestidad_confiabilidad" checked={opcionesEvaluacion.honestidadConfiabilidadEval.optimo === 'X'} onChange={() => marcarEvaluacion('honestidadConfiabilidad', 'optimo')} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <table className="w-full table-fixed divide-y divide-gray-200 border border-gray-400">
                        <thead className="bg-gray-50">
                            <tr>
                                <th rowSpan={2}
                                    className="w-[50%] px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ACTITUD,
                                    PERSONALIDAD E INTERACCIÓN
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">DEFICIENTE
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">REGULAR
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ADECUADO
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ÓPTIMO
                                </th>
                            </tr>
                        </thead>
                        <tbody className=" divide-y divide-gray-200">
                            {/* Actitud, personalidad e interacción */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Situaciones imprevistas</td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="situaciones_imprevistas" checked={opcionesEvaluacion.situacionesImprevistasEval.deficiente === 'X'} onChange={() => marcarEvaluacion('situacionesImprevistas', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="situaciones_imprevistas" checked={opcionesEvaluacion.situacionesImprevistasEval.regular === 'X'} onChange={() => marcarEvaluacion('situacionesImprevistas', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="situaciones_imprevistas" checked={opcionesEvaluacion.situacionesImprevistasEval.adecuado === 'X'} onChange={() => marcarEvaluacion('situacionesImprevistas', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="situaciones_imprevistas" checked={opcionesEvaluacion.situacionesImprevistasEval.optimo === 'X'} onChange={() => marcarEvaluacion('situacionesImprevistas', 'optimo')} /></td>
                            </tr>
                            {/* Figuras de autoridad y percepción de las mismas */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Figuras de autoridad y percepción de las
                                    mismas
                                </td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="figuras_autoridad" checked={opcionesEvaluacion.figurasAutoridadEval.deficiente === 'X'} onChange={() => marcarEvaluacion('figurasAutoridad', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="figuras_autoridad" checked={opcionesEvaluacion.figurasAutoridadEval.regular === 'X'} onChange={() => marcarEvaluacion('figurasAutoridad', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="figuras_autoridad" checked={opcionesEvaluacion.figurasAutoridadEval.adecuado === 'X'} onChange={() => marcarEvaluacion('figurasAutoridad', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="figuras_autoridad" checked={opcionesEvaluacion.figurasAutoridadEval.optimo === 'X'} onChange={() => marcarEvaluacion('figurasAutoridad', 'optimo')} /></td>
                            </tr>
                            {/* Grado de estabilidad emocional, manejo de la impulsividad */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Grado de estabilidad emocional, manejo de
                                    la impulsividad
                                </td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grado_estabilidad" checked={opcionesEvaluacion.gradoEstabilidadEval.deficiente === 'X'} onChange={() => marcarEvaluacion('gradoEstabilidad', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grado_estabilidad" checked={opcionesEvaluacion.gradoEstabilidadEval.regular === 'X'} onChange={() => marcarEvaluacion('gradoEstabilidad', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grado_estabilidad" checked={opcionesEvaluacion.gradoEstabilidadEval.adecuado === 'X'} onChange={() => marcarEvaluacion('gradoEstabilidad', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grado_estabilidad" checked={opcionesEvaluacion.gradoEstabilidadEval.optimo === 'X'} onChange={() => marcarEvaluacion('gradoEstabilidad', 'optimo')} /></td>
                            </tr>
                            {/* Tolerancia al estrés, a las frustraciones, al trabajo bajo presión */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Tolerancia al estrés, a las frustraciones,
                                    al trabajo bajo presión
                                </td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="tolerancia_estres" checked={opcionesEvaluacion.toleranciaEstresEval.deficiente === 'X'} onChange={() => marcarEvaluacion('toleranciaEstres', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="tolerancia_estres" checked={opcionesEvaluacion.toleranciaEstresEval.regular === 'X'} onChange={() => marcarEvaluacion('toleranciaEstres', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="tolerancia_estres" checked={opcionesEvaluacion.toleranciaEstresEval.adecuado === 'X'} onChange={() => marcarEvaluacion('toleranciaEstres', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="tolerancia_estres" checked={opcionesEvaluacion.toleranciaEstresEval.optimo === 'X'} onChange={() => marcarEvaluacion('toleranciaEstres', 'optimo')} /></td>
                            </tr>
                            {/* Concepto de sí mismo, autoimagen */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Concepto de sí mismo, autoimagen</td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="concepto_mismo" checked={opcionesEvaluacion.conceptoMismoEval.deficiente === 'X'} onChange={() => marcarEvaluacion('conceptoMismo', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="concepto_mismo" checked={opcionesEvaluacion.conceptoMismoEval.regular === 'X'} onChange={() => marcarEvaluacion('conceptoMismo', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="concepto_mismo" checked={opcionesEvaluacion.conceptoMismoEval.adecuado === 'X'} onChange={() => marcarEvaluacion('conceptoMismo', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="concepto_mismo" checked={opcionesEvaluacion.conceptoMismoEval.optimo === 'X'} onChange={() => marcarEvaluacion('conceptoMismo', 'optimo')} /></td>
                            </tr>
                            {/* Autonomía e iniciativa */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Autonomía e iniciativa</td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="autonomia_iniciativa" checked={opcionesEvaluacion.autonomiaIniciativaEval.deficiente === 'X'} onChange={() => marcarEvaluacion('autonomiaIniciativa', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="autonomia_iniciativa" checked={opcionesEvaluacion.autonomiaIniciativaEval.regular === 'X'} onChange={() => marcarEvaluacion('autonomiaIniciativa', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="autonomia_iniciativa" checked={opcionesEvaluacion.autonomiaIniciativaEval.adecuado === 'X'} onChange={() => marcarEvaluacion('autonomiaIniciativa', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="autonomia_iniciativa" checked={opcionesEvaluacion.autonomiaIniciativaEval.optimo === 'X'} onChange={() => marcarEvaluacion('autonomiaIniciativa', 'optimo')} /></td>
                            </tr>
                            {/* Tipo de Motivación que mueve sus conductas, actuales y futuras estabilidad Laboral predecible. */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Tipo de Motivación que mueve sus conductas,
                                    actuales y futuras estabilidad Laboral predecible.
                                </td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="tipo_motivacion" checked={opcionesEvaluacion.tipoMotivacionEval.deficiente === 'X'} onChange={() => marcarEvaluacion('tipoMotivacion', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="tipo_motivacion" checked={opcionesEvaluacion.tipoMotivacionEval.regular === 'X'} onChange={() => marcarEvaluacion('tipoMotivacion', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="tipo_motivacion" checked={opcionesEvaluacion.tipoMotivacionEval.adecuado === 'X'} onChange={() => marcarEvaluacion('tipoMotivacion', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="tipo_motivacion" checked={opcionesEvaluacion.tipoMotivacionEval.optimo === 'X'} onChange={() => marcarEvaluacion('tipoMotivacion', 'optimo')} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <table className="w-full table-fixed divide-y divide-gray-200 border border-gray-400">
                        <thead className="bg-gray-50">
                            <tr>
                                <th rowSpan={2}
                                    className="w-[50%] px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ÁREA
                                    DE LAS RELACIONES INTERPERSONALES
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">DEFICIENTE
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">REGULAR
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ADECUADO
                                </th>
                                <th rowSpan={2}
                                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-400 text-center align-middle">ÓPTIMO
                                </th>
                            </tr>
                        </thead>
                        <tbody className=" divide-y divide-gray-200">
                            {/* Capacidad de establecer y mantener contacto social  */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Capacidad de establecer y mantener contacto
                                    social
                                </td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_establecer" checked={opcionesEvaluacion.capacidadEstablecerEval.deficiente === 'X'} onChange={() => marcarEvaluacion('capacidadEstablecer', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_establecer" checked={opcionesEvaluacion.capacidadEstablecerEval.regular === 'X'} onChange={() => marcarEvaluacion('capacidadEstablecer', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_establecer" checked={opcionesEvaluacion.capacidadEstablecerEval.adecuado === 'X'} onChange={() => marcarEvaluacion('capacidadEstablecer', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_establecer" checked={opcionesEvaluacion.capacidadEstablecerEval.optimo === 'X'} onChange={() => marcarEvaluacion('capacidadEstablecer', 'optimo')} /></td>
                            </tr>
                            {/* Empatía */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Empatía</td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="empatia" checked={opcionesEvaluacion.empatiaEval.deficiente === 'X'} onChange={() => marcarEvaluacion('empatia', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="empatia" checked={opcionesEvaluacion.empatiaEval.regular === 'X'} onChange={() => marcarEvaluacion('empatia', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="empatia" checked={opcionesEvaluacion.empatiaEval.adecuado === 'X'} onChange={() => marcarEvaluacion('empatia', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="empatia" checked={opcionesEvaluacion.empatiaEval.optimo === 'X'} onChange={() => marcarEvaluacion('empatia', 'optimo')} /></td>
                            </tr>
                            {/* Capacidad de persuasión e influencia sobre otros */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Capacidad de persuasión e influencia sobre
                                    otros
                                </td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_presuacion" checked={opcionesEvaluacion.capacidadPersuacionEval.deficiente === 'X'} onChange={() => marcarEvaluacion('capacidadPersuacion', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_presuacion" checked={opcionesEvaluacion.capacidadPersuacionEval.regular === 'X'} onChange={() => marcarEvaluacion('capacidadPersuacion', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_presuacion" checked={opcionesEvaluacion.capacidadPersuacionEval.adecuado === 'X'} onChange={() => marcarEvaluacion('capacidadPersuacion', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="capacidad_presuacion" checked={opcionesEvaluacion.capacidadPersuacionEval.optimo === 'X'} onChange={() => marcarEvaluacion('capacidadPersuacion', 'optimo')} /></td>
                            </tr>
                            {/* Grado de adecuación a normas y valores sociales */}
                            <tr>
                                <td className="px-4 py-2 border border-gray-400">Grado de adecuación a normas y valores
                                    sociales
                                </td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grado_adecuacion" checked={opcionesEvaluacion.gradoAdecuacionEval.deficiente === 'X'} onChange={() => marcarEvaluacion('gradoAdecuacion', 'deficiente')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grado_adecuacion" checked={opcionesEvaluacion.gradoAdecuacionEval.regular === 'X'} onChange={() => marcarEvaluacion('gradoAdecuacion', 'regular')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grado_adecuacion" checked={opcionesEvaluacion.gradoAdecuacionEval.adecuado === 'X'} onChange={() => marcarEvaluacion('gradoAdecuacion', 'adecuado')} /></td>
                                <td className="px-2 py-2 border border-gray-400 text-center"><input type="radio" name="grado_adecuacion" checked={opcionesEvaluacion.gradoAdecuacionEval.optimo === 'X'} onChange={() => marcarEvaluacion('gradoAdecuacion', 'optimo')} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
                {/* Área de la personalidad */}
                <h3 className="text-xl font-semibold text-gray-800 mb-4">3. ÁREA DE LA PERSONALIDAD</h3>
                <div className="mt-6">
                    <label htmlFor="area_intelectual" className="block text-sm font-medium text-gray-700 mb-1">Área intelectual:</label>
                    <textarea ref={areaIntelectualRef} name="area_intelectual" id="area_intelectual" value={areaIntelectual} rows={1} onInput={handleInput(areaIntelectualRef)} onChange={(e) => setAreaIntelectual(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
                </div>
                <div className="mt-6">
                    <label htmlFor="area_laboral" className="block text-sm font-medium text-gray-700 mb-1">Área laboral:</label>
                    <textarea ref={areaLaboralRef} name="area_laboral" id="area_laboral" value={areaLaboral} rows={1} onInput={handleInput(areaLaboralRef)} onChange={(e) => setAreaLaboral(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
                </div>
                <div className="mt-6">
                    <label htmlFor="area_socio_afectiva" className="block text-sm font-medium text-gray-700 mb-1">Área socio-afectiva:</label>
                    <textarea ref={areaSocioAfectivaRef} name="area_socio_afectiva" id="area_socio_afectiva" value={areaSocioAfectiva} rows={1} onInput={handleInput(areaSocioAfectivaRef)} onChange={(e) => setAreaSocioAfectiva(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
                </div>
            </section>
            <section className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">4. ANÁLISIS CUALITATIVO</h3>
                <div className="mt-6">
                    <label htmlFor="fortalezas" className="block text-sm font-medium text-gray-700 mb-1">Fortalezas:</label>
                    <textarea ref={fortalezasRef} name="fortalezas" id="fortalezas" value={fortalezas} rows={1} onInput={handleInput(fortalezasRef)} onChange={(e) => setFortalezas(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Escribe una fortaleza y presiona Enter para escribir la siguiente."></textarea>
                </div>
                <div className="mt-6">
                    <label htmlFor="debilidades" className="block text-sm font-medium text-gray-700 mb-1">Debilidades:</label>
                    <textarea ref={debilidadesRef} name="debilidades" id="debilidades" value={debilidades} rows={1} onInput={handleInput(debilidadesRef)} onChange={(e) => setDebilidades(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Escribe una debilidad y presiona Enter para escribir la siguiente."></textarea>
                </div>
            </section>
            <section className="w-full bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">5. CONCLUSIÓN</h3>
                {/*Conclusiones*/}
                <div className="mt-6">
                    <label htmlFor="conclusiones" className="block text-sm font-medium text-gray-700 mb-1">Concluido el análisis de la evaluación, se considera a la persona como:</label>
                    <label htmlFor="experiencia" className="block text-sm font-medium text-gray-700 mb-1">Años de experiencia:</label>
                    <textarea ref={experienciaRef} name="experiencia" id="experiencia" value={experiencia} rows={1} onInput={handleInput(experienciaRef)} onChange={(e) => setExperiencia(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Ej: cuenta con X años de experiencia en conducción de camiones, de ellos Y año de experiencia en conducción de camiones con carga peligrosa."></textarea>
                </div>
                <div className="mt-6">
                    <label htmlFor="habilidad" className="block text-sm font-medium text-gray-700 mb-1">Habilidad:</label>
                    <textarea ref={conclusionesRef} name="habilidad" id="habilidad" value={conclusiones} rows={1} onInput={handleInput(conclusionesRef)} onChange={(e) => setConclusiones(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Ej: cuenta/no cuenta con las habilidades psicolaborales necesarias para la conducción de camiones con carga peligrosa."></textarea>
                </div>
                {/*Conclusiones Nivel Somnolencia*/}
                <div className="mt-6">
                    <label htmlFor="conclusion_somnolencia" className="block text-sm font-medium text-gray-700 mb-1">Nivel de somnolencia:</label>
                    <select name="conclusion_somnolencia" id="conclusion_somnolencia" value={nivelSomnolencia} onChange={(e) => setNivelSomnolencia(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                        <option value="" disabled hidden>Seleccione una opción</option>
                        <option value="Sin Somnolencia">Sin Somnolencia</option>
                        <option value="Somnolencia leve">Somnolencia leve</option>
                        <option value="Con Somnolencia">Con Somnolencia</option>
                    </select>
                </div>
                {/* Checkbox */}
                <div className="mt-4">
                    <input type="checkbox" id="requiereSugerencias" checked={requiereSugerencias} onChange={handleCheckboxChange} className="w-4 h-4" />
                    <label htmlFor="requiereSugerencias" className="text-sm font-medium">Requiere sugerencias</label>
                </div>

                {/* Textarea condicional */}
                {requiereSugerencias && (
                    <div className="mt-4">
                        <label htmlFor="sugerencias" className="block text-sm font-medium mb-1">Escribe las sugerencias</label>
                        <textarea id="sugerencias" name="sugerencias" rows={1} value={sugerencias} onChange={(e) => setSugerencias(e.target.value)} className="w-full p-2 border rounded" placeholder="Escribe tus sugerencias aquí..." />
                    </div>)}
                {/*Estado de la evaluación*/}
                <div className="mt-6">
                    <label htmlFor="estado_evaluacion" className="block text-sm font-medium text-gray-700 mb-1">Evaluación final:</label>
                    <select name="estado_evaluacion" id="estado_evaluacion" value={estadoEvaluacion} onChange={(e) => setEstadoEvaluacion(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                        <option value="" disabled hidden>Seleccione una opción</option>
                        <option value="APROBADO">APROBADO</option>
                        <option value="APROBADO CON OBSERVACIONES">APROBADO CON OBSERVACIONES</option>
                        <option value="RECHAZADO">RECHAZADO</option>
                    </select>
                    {estadoEvaluacion === 'APROBADO CON OBSERVACIONES' && (
                        <div className="mt-4">
                            <label htmlFor="aprobado_observaciones" className="block text-sm font-medium text-gray-700 mb-1">Observaciones:</label>
                            <textarea name="aprobado_observaciones" id="aprobado_observaciones" value={observaciones} rows={1} onChange={(e) => setObservaciones(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"></textarea>
                        </div>
                    )}
                </div>
                {/* <div className="mt-6 flex flex-col items-center w-1/3 h-full mx-auto">
                    <span>Firma de Psicológico</span>
                    <div
                        className={`border-2 border-dashed ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
                            } rounded-lg p-12 w-full max-w-2xl flex flex-col items-center justify-center cursor-pointer`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={handleChooseFiles}
                    >
                        <div className="mb-4">
                            <svg
                                className="w-16 h-16 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>
                        </div>
                        <div className="mb-3">
                            <button
                                type="button"
                                className="py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleChooseFiles();
                                }}
                            >
                                Choose files to Upload
                            </button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="application/pdf,image/*"
                                onChange={handleFileSelect}
                            />
                        </div>

       
                        {selectedFile ? (
                            <div className="mt-2 text-center">
                                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type}</p>
                                <button
                                    className="mt-3 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleRemoveFile();
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-sm text-gray-600">or drag and drop</p>
                                <p className="text-sm text-gray-600">PDF or Image files here</p>
                            </div>
                        )}



                        {fileError && (
                            <div className="mt-3 text-center">
                                <p className="text-sm text-red-600">{fileError}</p>
                            </div>
                        )}
                    </div>
                </div> */}
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
                {/* Botón enviar */}
                <div className="flex justify-center mt-6">
                    <button onClick={handleSubmit} type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow transition-colors">Enviar
                        Datos
                    </button>
                </div>
            </section>
        </div>
    );
}