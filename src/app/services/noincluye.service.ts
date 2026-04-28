import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface NoIncluye {
  id: number;
  descripcion: string;
}

export interface NoIncluyePayload {
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
export class NoIncluyeService {

  async getAll(): Promise<NoIncluye[]> {
    const res = await adminApi().get<ApiResponse<NoIncluye[]>>('/NoIncluye');
    return res.data.data;
  }

  async getById(id: number): Promise<NoIncluye> {
    const res = await adminApi().get<ApiResponse<NoIncluye>>(`/NoIncluye/${id}`);
    return res.data.data;
  }

  async create(payload: NoIncluyePayload): Promise<ApiResponse<any>> {
    const res = await adminApi().post<ApiResponse<any>>('/NoIncluye', payload);
    return res.data;
  }

  async update(id: number, payload: NoIncluyePayload): Promise<ApiResponse<any>> {
    const res = await adminApi().put<ApiResponse<any>>(`/NoIncluye/${id}`, payload);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<any>> {
    const res = await adminApi().delete<ApiResponse<any>>(`/NoIncluye/${id}`);
    return res.data;
  }
}