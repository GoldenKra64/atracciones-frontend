import { Injectable } from '@angular/core';
import api from './api.service';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data: T;
}

export interface ClientePayload {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  correo: string;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  direccion: string | null;
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

export interface ClienteProfile {
  numeroIdentificacion: string;
  correo: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  id: number;
  guid: string;
}

export interface FacturaItem {
  id: number;
  guid: string;
  numero: string;
  fechaEmision: string;
  total: number;
  origenCanal: string;
  observacion: string;
  estado: string;
}

export interface FacturasResponse {
  items: FacturaItem[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  async getProfile(): Promise<ClienteProfile> {
    const res = await api.get('/cliente/profile');
    return res.data.data;
  }

  async getFacturas(page = 1, size = 20): Promise<FacturasResponse> {
    const res = await api.get('/factura', { params: { page, size } });
    return res.data.data;
  }

  // Admin CRUD methods
  async getAll(): Promise<ClienteProfile[]> {
    const res = await adminApi().get<ApiResponse<ClienteProfile[]>>('/Cliente');
    return res.data.data;
  }

  async getById(id: number): Promise<ClienteProfile> {
    const res = await adminApi().get<ApiResponse<ClienteProfile>>(`/Cliente/${id}`);
    return res.data.data;
  }

  async create(payload: ClientePayload): Promise<ApiResponse<any>> {
    const res = await adminApi().post<ApiResponse<any>>('/Cliente', payload);
    return res.data;
  }

  async update(id: number, payload: ClientePayload): Promise<ApiResponse<any>> {
    const res = await adminApi().put<ApiResponse<any>>(`/Cliente/${id}`, payload);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<any>> {
    const res = await adminApi().delete<ApiResponse<any>>(`/Cliente/${id}`);
    return res.data;
  }
}
