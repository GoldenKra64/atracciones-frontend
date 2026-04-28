import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface Incluye {
  id: number;
  descripcion: string;
}

export interface IncluyePayload {
  descripcion: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data: T;
}

export interface ApiError {
  Success: boolean;
  Message: string;
  Errors: string[];
  TraceId: string;
}

// Instancia con token de ADMIN
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
export class IncluyeService {

  async getAll(): Promise<Incluye[]> {
    const res = await adminApi().get<ApiResponse<Incluye[]>>('/Incluye');
    return res.data.data;
  }

  async getById(id: number): Promise<Incluye> {
    const res = await adminApi().get<ApiResponse<Incluye>>(`/Incluye/${id}`);
    return res.data.data;
  }

  async create(payload: IncluyePayload): Promise<ApiResponse<any>> {
    const res = await adminApi().post<ApiResponse<any>>('/Incluye', payload);
    return res.data;
  }

  async update(id: number, payload: IncluyePayload): Promise<ApiResponse<any>> {
    const res = await adminApi().put<ApiResponse<any>>(`/Incluye/${id}`, payload);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<any>> {
    const res = await adminApi().delete<ApiResponse<any>>(`/Incluye/${id}`);
    return res.data;
  }
}