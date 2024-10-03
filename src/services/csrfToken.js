import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://backend.ddev.site";

// Configuración de la instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar errores de manera global, si es necesario
    console.error("Axios error:", error.response || error.message);
    return Promise.reject(error);
  }
);

// Función para obtener el CSRF Token
export const fetchCsrfToken = async () => {
  try {
    const response = await apiClient.get("/session/token");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch CSRF token");
  }
};
