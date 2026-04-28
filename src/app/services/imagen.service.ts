import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface Imagen {
  id: number;
  descripcion: string;
  url: string;
  atraccionId: number;
}

export interface AtraccionType {
  id: number;
  name: string;
}

export interface ImagenPayload {
  descripcion: string;
  url: string;
  atraccionId: number;
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
export class ImagenService {

  async getAll(): Promise<Imagen[]> {
    const res = await adminApi().get<ApiResponse<Imagen[]>>('/Imagen');
    return res.data.data;
  }

  async getById(id: number): Promise<Imagen> {
    const res = await adminApi().get<ApiResponse<Imagen>>(`/Imagen/${id}`);
    return res.data.data;
  }

  async create(payload: ImagenPayload): Promise<ApiResponse<any>> {
    const res = await adminApi().post<ApiResponse<any>>('/Imagen', payload);
    return res.data;
  }

  async update(id: number, payload: ImagenPayload): Promise<ApiResponse<any>> {
    const res = await adminApi().put<ApiResponse<any>>(`/Imagen/${id}`, payload);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<any>> {
    const res = await adminApi().delete<ApiResponse<any>>(`/Imagen/${id}`);
    return res.data;
  }

  async getAtraccionesType(): Promise<AtraccionType[]> {
    const res = await adminApi().get<ApiResponse<AtraccionType[]>>('/atracciones/type');
    return res.data.data;
  }
}