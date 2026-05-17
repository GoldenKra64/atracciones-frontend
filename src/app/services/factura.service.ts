import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface FacturaAdmin {
  id: number;
  guid: string;
  numero: string;
  fechaEmision: string;
  total: number;
  origenCanal: string;
  observacion: string;
  estado: string;
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
export class FacturaService {
  async getAllAdmin(): Promise<FacturaAdmin[]> {
    const res = await adminApi().get<ApiResponse<FacturaAdmin[]>>('/facturas');
    return res.data.data;
  }
}
