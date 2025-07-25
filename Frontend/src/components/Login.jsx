import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { storage } from '../storage';

/**
 * Componente funcional para el inicio de sesión de usuarios.
 * @module Login
 * @description Permite a los usuarios autenticarse mediante correo electrónico y contraseña, y redirige según el rol del usuario.
 * @returns {JSX.Element} El formulario de inicio de sesión.
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    /**
     * Maneja el envío del formulario de inicio de sesión.
     * @async
     * @function handleSubmit
     * @param {Event} e - Evento de envío del formulario.
     * @description Autentica al usuario y lo redirige a la ruta correspondiente según su rol.
     */
    const handleSubmit = async (e) => { // Aqui hay que agregar los demas path y validaciones segun rol
        e.preventDefault();
        const success = await login(email, password);

        if (success) {
            const userRole = storage.getUserRole();
            console.log(userRole);
            switch (userRole) {
                case "Secretari@":
                    navigate('/Secretary');
                    break;
                case "Administrador":
                    navigate('/Administrador');
                    break;
                case "Psicotecnic@":
                    navigate('/Psicotecnica');
                    break;
                default:
                    navigate('/');
            }
        } else {
            setError('Credenciales inválidas');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <img
                        className="mx-auto h-48 w-auto mb-4"
                        src="../assets/Quality_Trans_logo.png"
                        alt="Tecno Quality"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar sesión
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login; 