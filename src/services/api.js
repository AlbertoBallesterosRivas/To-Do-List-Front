import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://backend.ddev.site";

// Crea una instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar el token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para obtener el CSRF Token usando la instancia de Axios
export const fetchCsrfToken = async () => {
  try {
    const response = await api.get("/session/token");
    return response.data;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch CSRF token");
  }
};

export default api;
