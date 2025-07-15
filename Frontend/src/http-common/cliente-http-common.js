import axios from "axios";

const clienteHttp = axios.create({
  baseURL: "http://localhost:8082",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para manejar respuestas
clienteHttp.interceptors.response.use(
  (response) => {
    // Verificar si la respuesta es HTML
    if (
      typeof response.data === "string" &&
      response.data.includes("<!DOCTYPE html>")
    ) {
      return Promise.reject(new Error("Respuesta inválida del servidor"));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.status === 401) {
        // Manejar error de autenticación
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default clienteHttp;
