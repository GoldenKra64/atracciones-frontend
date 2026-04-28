import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface Destino {
  id: number;
  guid: string;
  nombre: string;
  pais: string;
}

export interface DestinoPayload {
  nombre: string;
  pais: string;
  imagenUrl: string;
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
export class DestinoService {

  async getAll(): Promise<Destino[]> {
    const res = await adminApi().get<ApiResponse<Destino[]>>('/Destino');
    return res.data.data;
  }

  async getById(id: number): Promise<Destino> {
    const res = await adminApi().get<ApiResponse<Destino>>(`/Destino/${id}`);
    return res.data.data;
  }

  async create(payload: DestinoPayload): Promise<ApiResponse<any>> {
    const res = await adminApi().post<ApiResponse<any>>('/Destino', payload);
    return res.data;
  }

  async update(id: number, payload: DestinoPayload): Promise<ApiResponse<any>> {
    const res = await adminApi().put<ApiResponse<any>>(`/Destino/${id}`, payload);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<any>> {
    const res = await adminApi().delete<ApiResponse<any>>(`/Destino/${id}`);
    return res.data;
  }
}