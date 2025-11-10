import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  },
  timeout: 10000 // 10 segundos
});

// Interceptor de request
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar tokens de autenticación si los necesitas
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error de respuesta:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('Error de red:', error.request);
    } else {
      // Algo pasó al configurar la petición
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
