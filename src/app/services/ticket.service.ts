import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface Ticket {
  id: number;
  guid: string;
  nombre: string;
  precio: number;
  tipo: string;
  horarioId: number;
}

export interface TicketPayload {
  horarioId: number;
  nombre: string;
  precio: number;
  tipo: string;
}

export interface HorarioOption {
  horarioId: number;
  atraccionId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string | null;
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
export class TicketService {
  async getAll(): Promise<Ticket[]> {
    const res = await adminApi().get<ApiResponse<Ticket[]>>('/tickets');
    return res.data.data;
  }

  async getById(id: number): Promise<Ticket> {
    const res = await adminApi().get<ApiResponse<Ticket>>(`/tickets/${id}`);
    return res.data.data;
  }

  async create(payload: TicketPayload): Promise<ApiResponse<any>> {
    const res = await adminApi().post<ApiResponse<any>>('/tickets', payload);
    return res.data;
  }

  async update(id: number, payload: TicketPayload): Promise<ApiResponse<any>> {
    const res = await adminApi().put<ApiResponse<any>>(`/tickets/${id}`, payload);
    return res.data;
  }

  async delete(id: number): Promise<ApiResponse<any>> {
    const res = await adminApi().delete<ApiResponse<any>>(`/tickets/${id}`);
    return res.data;
  }

  async getHorarios(): Promise<HorarioOption[]> {
    const res = await adminApi().get<ApiResponse<HorarioOption[]>>('/Horario');
    return res.data.data;
  }
}
