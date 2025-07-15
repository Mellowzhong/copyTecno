import { storage } from '../../storage';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"
import clienteHttp from '../../http-common/cliente-http-common';
import formularioHttp from '../../http-common/formulario-http-common';
import Navegacion from "../../components/Navegación.jsx";

/**
 * Componente funcional para visualizar y gestionar la lista de conductores y sus formularios sicologicos.
 * @module ViewDriverPsychologist
 * @description Permite buscar, filtrar y gestionar los conductores, así como navegar a la edición de sus formularios sicologicos.
 * @returns {JSX.Element} La vista principal de gestión de conductores sicologicos.
 */
const ViewDriverPsychologist = () => {
  // Estado para los datos del usuario
  const userData = storage.getUserData();
  const navigate = useNavigate();
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para los conductores filtrados
  const [conductoresFiltrados, setConductoresFiltrados] = useState(conductores)

  /**
   * Efecto para filtrar la lista de conductores según el término de búsqueda.
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
   * Efecto para cargar la lista inicial de conductores y verificar sus archivos.
   * @function
   * @listens (ninguno, solo se ejecuta una vez)
   * @description Realiza la carga inicial de conductores y verifica si tienen archivo asociado.
   */
  useEffect(() => {
    const cargarConductores = async () => {
      try {
        const response = await clienteHttp.get('/Cliente/buscarConductores/hoy');
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
  }, []);

  /**
   * Verifica si cada conductor tiene un archivo de formulario asociado.
   * @async
   * @function verificarArchivos
   * @param {Array<Object>} conductores - Lista de conductores a verificar.
   * @returns {Promise<void>}
   * @description Realiza una petición al servidor por cada conductor para comprobar si tiene un formulario asociado.
   */
  const verificarArchivos = async (conductores) => {
    const idUsuario = storage.getUserId(); // ← Asegúrate que devuelve el ID, no la función
    const resultados = await Promise.all(
      conductores.map(async (conductor) => {
        try {
          const res = await formularioHttp.get(
            `/Formulario/comprobarFormulario/${conductor.id}/${idUsuario}`
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
   * Maneja el cambio en el campo de búsqueda.
   * @function handleSearch
   * @param {Event} e - Evento del input de búsqueda.
   */
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  /**
   * Maneja la navegación para completar el formulario médico de un conductor.
   * @function handleCompletarFormulario
   * @param {number|string} idUsuario - ID del usuario actual.
   * @param {number|string} idCliente - ID del conductor.
   * @description Navega a la ruta de edición del formulario médico con los IDs correspondientes.
   */
  const handleCompletarFormulario = (idUsuario, idCliente) => {
    console.log("Completar formulario para conductor ID:", idCliente)
    navigate("/PsychologistForm", {
      state: {
        idUsuario: idUsuario,
        idConductor: idCliente
      }
    })
  }

  // Manejador para eliminar archivo
  const handleEliminarArchivo = (idConductor) => {
    const idUsuario = storage.getUserId()
    const eliminarArchivo = async () => {
      try {
        const response = await formularioHttp.delete(`/Formulario/eliminarArchivo/${idConductor}/${idUsuario}`)
        if(response.status === 200){
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
      <Navegacion titulo={`Listado de conductores [${userData.rol_usuario}]`} />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="relative">
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
              className="pl-10 py-2 border border-gray-300 rounded-full w-full md:w-80"
              value={searchTerm}
              onChange={handleSearch}
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
                  Completar Formulario
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
                      onClick={() => handleCompletarFormulario(storage.getUserId(), conductor.id)}
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
                        <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                        <line x1="8" y1="9" x2="16" y2="9" />
                        <line x1="8" y1="13" x2="16" y2="13" />
                        <line x1="8" y1="17" x2="12" y2="17" />
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

export default ViewDriverPsychologist