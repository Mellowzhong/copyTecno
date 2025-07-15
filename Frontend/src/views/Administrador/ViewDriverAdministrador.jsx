import { storage } from '../../storage.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import clienteHttp from '../../http-common/cliente-http-common.js';
import documentosHttp from '../../http-common/documentos-http-common.js';
import Navegacion from "../../components/Navegación.jsx";

/**
 * Componente funcional para la vista de gestión de conductores y sus credenciales.
 * @module ViewDriverAdministrador
 * @description Permite buscar, filtrar y gestionar archivos de credenciales de conductores según diferentes fechas y filtros de búsqueda.
 * @returns {JSX.Element} La vista principal de gestión de conductores y credenciales.
 */
const ViewDriverAdministrador = () => {
  // Estado para los datos del usuario
  const userData = storage.getUserData();
  const navigate = useNavigate();
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fechaDesde, setFechaDesde] = useState(() => {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset()); // ajusta la zona horaria local
    return hoy.toISOString().split("T")[0];
  });
  const [inputFecha, setInputFecha] = useState(fechaDesde);

  // Estado para los conductores filtrados
  const [conductoresFiltrados, setConductoresFiltrados] = useState(conductores)

  /**
   * Efecto para filtrar conductores según el término de búsqueda.
   * @function
   * @listens searchTerm, conductores
   * @description Actualiza la lista filtrada de conductores cuando cambia el término de búsqueda o la lista original.
   */
  useEffect(() => {
    setConductoresFiltrados(
      conductores.filter((conductor) => conductor.nombre.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [searchTerm, conductores])

  /**
   * Verifica si cada conductor tiene un archivo de credencial asociado.
   * @async
   * @function verificarArchivos
   * @param {Array<Object>} conductores - Lista de conductores a verificar.
   * @returns {Promise<void>}
   * @description Realiza una petición al servidor por cada conductor para comprobar si tiene un archivo asociado.
   */
  const verificarArchivos = async (conductores) => {
    const idUsuario = storage.getUserId(); // ← Asegúrate que devuelve el ID, no la función
    const resultados = await Promise.all(
      conductores.map(async (conductor) => {
        try {
          const res = await documentosHttp.get(
            `/documentos/credenciales/comprobarArchivo/${conductor.id}/${idUsuario}`
          );
          return {
            ...conductor,
            tieneArchivo: res.data, // o según cómo responde tu backend
          };
        } catch (error) {
          console.error(`Error al verificar archivo del conductor ${conductor.id}:`, error);
          return {
            ...conductor,
            tieneArchivo: false, // por defecto en caso de error
          };
        }
      })
    );

    setConductores(resultados);
  };

  /**
   * Efecto para cargar la lista inicial de conductores y verificar sus archivos.
   * @function
   * @listens fechaDesde
   * @description Realiza la carga inicial de conductores y verifica si tienen archivo asociado según la fecha seleccionada.
   */
  useEffect(() => {
    const cargarConductores = async () => {
      try {
        const response = await clienteHttp.get(`/Cliente/buscarConductores/fecha/${fechaDesde}`);
        console.log(response.data);
        if (response.status === 200) {
          await verificarArchivos(response.data);
        }
      } catch (error) {
        console.error('Error al cargar conductores:', error);
        setError('Error al cargar la lista de conductores');
      } finally {
        setLoading(false);
      }
    };

    cargarConductores();
  }, [fechaDesde]);

  /**
   * Maneja el cambio en el campo de búsqueda.
   * @function handleSearch
   * @param {Event} event - Evento de cambio del input de búsqueda.
   */
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  /**
   * Maneja la navegación para subir un archivo de credencial para un conductor.
   * @function handleSubirArchivo
   * @param {number|string} idUsuario - ID del usuario actual.
   * @param {number|string} idConductor - ID del conductor.
   * @description Navega a la vista de subida de archivos con los IDs correspondientes.
   */
  const handleSubirArchivo = (idUsuario, idConductor) => {
    console.log("Subir archivo para conductor ID:", idConductor)
    navigate("/UploadFileAdministrador", {
      state: {
        idUsuario: idUsuario,
        idConductor: idConductor
      }
    })
  }

  /**
   * Maneja la eliminación de un archivo de credencial para un conductor.
   * @async
   * @function handleEliminarArchivo
   * @param {number|string} idConductor - ID del conductor.
   * @description Realiza una petición al servidor para eliminar el archivo asociado al conductor y recarga la página.
   */
  const handleEliminarArchivo = (idConductor) => {
    const idUsuario = storage.getUserId()
    const eliminarArchivo = async () => {
      try {
        const response = await documentosHttp.delete(`/documentos/credenciales/eliminarArchivo/${idConductor}/${idUsuario}`)
        if (response.status === 200) {
          console.log(response)
        }
      } catch (error) {
        console.error('Error al elminar el archivo:', error)
        setError('Ocurrio un error inesperado al intentar borrar el archivo')

      }
    }
    eliminarArchivo()
    window.location.reload()
  }

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
      <Navegacion titulo={`Asignar credencial a conductor [${userData.rol_usuario}]`} />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar + Fecha */}
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
              placeholder="Buscar conductor"
              className="pl-10 py-2 border border-gray-300 rounded-full w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Selector de fecha */}
          <div className="flex items-center gap-2">
            <label htmlFor="fechaDesde" className="text-gray-700 font-medium">Desde:</label>
            <input
              type="date"
              id="fechaDesde"
              className="border border-gray-300 rounded px-3 py-2"
              value={inputFecha}
              onChange={(e) => setInputFecha(e.target.value)}
              onBlur={() => setFechaDesde(inputFecha)} // solo actualiza la fecha real cuando se termina de editar
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();         // previene recarga o comportamiento inesperado
                  setFechaDesde(inputFecha); // actualiza la fecha real al presionar Enter
                }
              }}
            />
          </div>
        </div>

        {/* Conductors Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="py-3 px-4 bg-blue-200 text-left text-lg font-medium text-gray-800 border border-gray-300">
                  Nombre Conductor
                </th>
                <th className="py-3 px-4 bg-blue-200 text-center text-lg font-medium text-gray-800 border border-gray-300">
                  Subir archivo
                </th>
                <th className="py-3 px-4 bg-blue-200 text-center text-lg font-medium text-gray-800 border border-gray-300">
                  Eliminar archivo
                </th>
                <th className="py-3 px-4 bg-blue-200 text-center text-lg font-medium text-gray-800 border border-gray-300">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {conductoresFiltrados.map((conductor) => (
                <tr key={conductor.id} className="border border-gray-300">
                  <td className="py-3 px-4 text-gray-800 border border-gray-300">{conductor.nombre + " " + conductor.apellido}</td>
                  <td className="py-3 px-4 text-center border border-gray-300">
                    <button
                      onClick={() => handleSubirArchivo(storage.getUserId(), conductor.id)}
                      className="inline-flex justify-center items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center border border-gray-300">
                    <button
                      onClick={() => handleEliminarArchivo(conductor.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center border border-gray-300">
                    <div className="flex justify-center">
                      <div
                        className={`w-6 h-6 rounded-full ${conductor.tieneArchivo ? "bg-green-500" : "bg-red-500"
                          }`}
                      />
                    </div>
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

export default ViewDriverAdministrador