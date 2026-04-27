import axios from 'axios';
import { environment } from '../../environments/environment';

const api = axios.create({
  baseURL: environment.apiUrl,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('atraxia_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export default api;