import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface Horario {
  horarioId: number;
  horarioGuid: string;
  atraccionId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string | null;
  cupos: number;
}

export interface AtraccionType {
  id: number;
  name: string;
}

export interface HorarioPayload {
  atraccionId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string | null;
  cupos: number;
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
export class HorarioService {
  async getAll(): Promise<Horario[]> {
    const res = await adminApi().get<ApiResponse<Horario[]>>('/Horario');
    return res.data.data;
  }

  async getById(guid: string): Promise<Horario> {
    const res = await adminApi().get<ApiResponse<Horario>>(`/Horario/${guid}`);
    return res.data.data;
  }

  async create(payload: HorarioPayload): Promise<ApiResponse<any>> {
    const res = await adminApi().post<ApiResponse<any>>('/Horario', payload);
    return res.data;
  }

  async update(guid: string, payload: HorarioPayload): Promise<ApiResponse<any>> {
    const res = await adminApi().put<ApiResponse<any>>(`/Horario/${guid}`, payload);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<any>> {
    const res = await adminApi().delete<ApiResponse<any>>(`/Horario/${id}`);
    return res.data;
  }

  async getAtraccionesType(): Promise<AtraccionType[]> {
    const res = await adminApi().get<ApiResponse<AtraccionType[]>>('/atracciones/type');
    return res.data.data;
  }
}
