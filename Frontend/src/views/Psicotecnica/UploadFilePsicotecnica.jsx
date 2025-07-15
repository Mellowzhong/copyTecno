import { storage } from '../../storage';
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import documentosHttp from '../../http-common/documentos-http-common';
import Navegacion from "../../components/Navegación.jsx";

/**
 * Componente funcional para la subida de archivos psicotécnicos asociados a un conductor.
 * @module UploadFilePsicotecnica
 * @description Permite seleccionar, validar y enviar archivos PDF psicotécnicos al servidor para un conductor específico.
 * @returns {JSX.Element} La vista de subida de archivo psicotécnico.
 */
const UploadFilePsicotecnica = () => {
  // Añadimos useNavigate para la navegación
  const userData = storage.getUserData()
  const navigate = useNavigate()
  const location = useLocation()
  const { idUsuario, idConductor } = location.state || {}
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado para los datos del conductor
  //const [conductorData, setConductorData] = useState({ id: null, nombre: "" })

  // Estado para el error de validación
  const [fileError, setFileError] = useState("")

  // Estado para los archivos seleccionados
  const [selectedFile, setSelectedFile] = useState(null)

  // Estado para el área de arrastrar y soltar
  const [isDragging, setIsDragging] = useState(false)

  // Referencia al input de archivos
  const fileInputRef = useRef(null)

  // Efecto para obtener datos del usuario y del conductor
  /*useEffect(() => {
    // Simulando obtener datos del usuario desde localStorage o una API
    const getUserData = () => {
      // Aquí podrías implementar la lógica para obtener los datos del usuario
      return { rol_usuario: "Psicotécnica", nombre: "GenericUser123" }
    }

    setUserData(getUserData())

    // Recuperamos el ID y nombre del conductor de sessionStorage
    const conductorId = sessionStorage.getItem("conductorId")
    const conductorNombre = sessionStorage.getItem("conductorNombre")

    if (conductorId && conductorNombre) {
      setConductorData({
        id: Number.parseInt(conductorId),
        nombre: conductorNombre,
      })
    }
  }, [])*/

  /**
   * Valida el archivo seleccionado.
   * @function validateFile
   * @param {File} file - Archivo a validar.
   * @returns {boolean} `true` si el archivo es válido (PDF y menor a 10MB), `false` en caso contrario.
   */
  const validateFile = (file) => {
    // Verificar si es un archivo PDF
    if (file.type !== "application/pdf") {
      setFileError("Solo se permiten archivos PDF")
      return false
    }

    // Verificar el tamaño del archivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("El archivo no debe superar los 10MB")
      return false
    }

    // Archivo válido
    setFileError("")
    return true
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
   * Sube el archivo psicotécnico al servidor.
   * @async
   * @function subirArchivoPsicotecnica
   * @param {File} file - Archivo a subir.
   * @param {string} idUsuario - ID del usuario.
   * @param {string} idConductor - ID del conductor.
   * @returns {Promise<Object>} Respuesta del servidor.
   */
  const subirArchivoPsicotecnica = async (file, idUsuario, idConductor) => {
    // Ejemplo de cómo podrías enviar los archivos usando FormData
    const formData = new FormData()
    // Añadimos los ids de conductor y usuario si existen
    if (idConductor && idUsuario) {
      formData.append('idConductor', idConductor)
      formData.append('idUsuario', idUsuario)
    }

    // Añadimos el archivo
    formData.append('archivoPsicotecnica', file)
    console.log(file)
    console.log(idConductor)
    console.log(idUsuario)
    try {
      const response = await documentosHttp.post('/documentos/psicotecnica/subir', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => data,
      });

      return response.data
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      let errorMessage = 'Error al cargar el archivo';
      if (error.response) {
        // El servidor respondió con un status code fuera del rango 2xx
        errorMessage = error.response.data?.message ||
          `Error del servidor: ${error.response.status}`;
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorMessage = 'No se recibió respuesta del servidor';
      } else {
        // Error al configurar la petición
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Maneja el envío del formulario.
   * @async
   * @function handleSubmit
   */
  const handleSubmit = async () => {
    if (!selectedFile) {
      setFileError("Por favor, seleccione un archivo PDF para subir.")
      return
    }

    // Aquí implementarías la lógica para enviar los archivos al servidor




    // Simulación de envío

    try {
      setLoading(true);
      setError(null);

      await subirArchivoPsicotecnica(selectedFile, idUsuario, idConductor);

      // Éxito
      setSelectedFile(null);
      navigate("/ViewDriverPsicotecnica");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Navega a la vista anterior.
   * @function handleVolver
   */
  const handleVolver = () => {

    // Volvemos a la vista de conductores
    navigate("/ViewDriverPsicotecnica")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/*Componente de navegación*/}
      <Navegacion titulo={`Subir credencial de conductor [${userData.rol_usuario}]`} />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Upload Area */}
        <div className="mt-6 flex flex-col items-center">
          <div
            className={`border-2 border-dashed ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
              } rounded-lg p-12 w-full max-w-2xl flex flex-col items-center justify-center cursor-pointer`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleChooseFiles}
          >
            {/* Cloud Upload Icon */}
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

            {/* Choose Files Button */}
            <div className="mb-3">
              <button
                className="py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={(e) => {
                  e.stopPropagation()
                  handleChooseFiles()
                }}
              >
                Choose files to Upload
              </button>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
            </div>

            {/* Drag and Drop Text or Selected File */}
            {selectedFile ? (
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024).toFixed(2)} KB • PDF</p>
                <button
                  className="mt-3 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile()
                  }}
                >
                  <svg
                    className="w-4 h-4 mr-1 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  Eliminar
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600">or drag and drop</p>
                <p className="text-xs text-gray-500 mt-2">Solo archivos PDF (máx. 10MB)</p>
              </div>
            )}

            {/* Error Message */}
            {fileError && (
              <div className="mt-3 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              className="py-2 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleVolver}
            >
              Volver
            </button>
            <button
              className="py-2 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSubmit}
            >
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UploadFilePsicotecnica
