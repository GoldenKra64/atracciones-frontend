import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

export interface ReservaDetalle {
  tck_guid: string;
  tck_tipo_participante: string;
  cantidad: number;
  precio_unit: number;
  subtotal: number;
}

export interface Reserva {
  rev_guid: string;
  rev_codigo: string;
  hor_fecha: string;
  hor_hora_inicio: string;
  hor_hora_fin: string;
  atraccion_nombre: string;
  rev_subtotal: number;
  rev_valor_iva: number;
  rev_total: number;
  moneda: string;
  rev_estado: string;
  rev_fecha_reserva_utc: string;
  detalle: ReservaDetalle[];
  id: number;
  guid: string | null;
}

export interface ReservaLineaPayload {
  tck_guid: string;
  cantidad: number;
}

export interface ReservaPayload {
  clienteId: number;
  hor_guid: string;
  origen_canal: string;
  lineas: ReservaLineaPayload[];
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
export class ReservaService {
  async getAll(): Promise<Reserva[]> {
    const res = await adminApi().get<ApiResponse<Reserva[]>>('/reservas');
    return res.data.data;
  }

  async getById(guid: string): Promise<Reserva> {
    const res = await adminApi().get<ApiResponse<Reserva>>(`/reservas/${guid}`);
    return res.data.data;
  }

  async create(payload: ReservaPayload): Promise<ApiResponse<Reserva>> {
    const res = await adminApi().post<ApiResponse<Reserva>>('/reservas', payload);
    return res.data;
  }

  async update(guid: string, payload: ReservaPayload): Promise<ApiResponse<Reserva>> {
    const res = await adminApi().put<ApiResponse<Reserva>>(`/reservas/${guid}`, payload);
    return res.data;
  }

  async cancel(guid: string): Promise<ApiResponse<any>> {
    const res = await adminApi().delete<ApiResponse<any>>(`/reservas/${guid}`);
    return res.data;
  }

  async approve(guid: string): Promise<ApiResponse<any>> {
    const res = await adminApi().post<ApiResponse<any>>(`/reservas/${guid}/confirmar-pago`);
    return res.data;
  }
}
