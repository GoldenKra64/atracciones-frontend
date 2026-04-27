import { Injectable } from '@angular/core';
import api from './api.service';

export interface ResenaItem {
  clienteId: number;
  atraccionId: number;
  calificacion: number;
  comentario: string;
  fecha: string;
}

export interface AtraccionItem {
  id: string; nombre: string; ciudad: string; pais: string;
  tipo_nombre: string; descripcion_corta: string; precio_desde: number;
  moneda: string; calificacion: number; total_resenias: number;
  duracion_minutos: number; imagen_principal: string; etiquetas: string[];
  disponible: boolean; disponible_hoy: boolean;
  proxima_fecha_disponible: string; cupos_disponibles: number;
  idiomas_disponibles?: string[];
}

export interface AtraccionDetalle {
  id: string; nombre: string; descripcion: string; imagenes: string[];
  incluye: string[]; no_incluye: string[]; punto_encuentro: string | null;
  incluye_transporte: boolean; incluye_acompaniante: boolean;
  tickets: { horId: number; tckGuid: string; tipo: string; precio: number; moneda: string }[];
  horarios_proximos: { horarioId: number; horarioGuid: string | null; atraccionId: number; fecha: string; horaInicio: string; horaFin: string; cupos: number }[];
}

@Injectable({ providedIn: 'root' })
export class AtraccionesService {
  async getAtracciones(filtros: Record<string, any> = {}) {
    const params: any = {};
    Object.entries(filtros).forEach(([k, v]) => { if (v !== '' && v !== undefined) params[k] = v; });
    const res = await api.get('/atracciones', { params });
    return res.data.data;
  }
  async getAtraccion(id: string): Promise<AtraccionDetalle> {
    const res = await api.get(`/atracciones/${id}`);
    return res.data.data;
  }
  async reservar(payload: any) {
    const res = await api.post('/reserva', payload);
    return res.data;
  }
  async getResenas(id: string): Promise<ResenaItem[]> {
    const res = await api.get(`/resena/atraccion/${id}`);
    return res.data.data;
  }
}