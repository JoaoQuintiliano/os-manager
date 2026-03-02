import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL do seu servidor Express
});

// Interceptor para enviar o token em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@SistemaOS:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;