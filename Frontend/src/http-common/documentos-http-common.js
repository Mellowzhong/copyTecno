import axios from "axios";

const documentosHttp = axios.create({
  baseURL: "http://localhost:8083",
  withCredentials: true
});

// Interceptor para manejar respuestas
documentosHttp.interceptors.response.use(
  (response) =>  response,
  (error) => {
    if (error.response?.status === 401) {
      // Manejar error de autenticación
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default documentosHttp;