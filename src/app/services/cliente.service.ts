import { Injectable } from '@angular/core';
import api from './api.service';

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
}
