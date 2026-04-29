import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface Categoria {
  id: number;
  guid: string;
  nombre: string;
  children: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data: T;
}

function adminApi() {
  const token = localStorage.getItem('atraxia_admin_token');
  return axios.create({
    baseURL: environment.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  async getAll(): Promise<Categoria[]> {
    const res = await adminApi().get<ApiResponse<Categoria[]>>('/Categoria');
    return res.data.data;
  }
}
