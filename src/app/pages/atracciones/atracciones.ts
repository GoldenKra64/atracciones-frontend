import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AtraccionesService, AtraccionItem } from '../../services/atracciones.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-atracciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './atracciones.html',
  styleUrls: ['./atracciones.scss']
})
export class AtraccionesComponent implements OnInit {
  items: AtraccionItem[] = [];
  loading = false;
  error = '';
  totalRecords = 0;
  totalPages = 0;
  hasPrev = false;
  hasNext = false;

  filtros = { Ciudad: '', Pais: '', Disponible: '', PageNumber: 1, PageSize: 9 };

  constructor(private svc: AtraccionesService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      const params: any = { ...this.filtros };
      if (params.Disponible === '') delete params.Disponible;
      else params.Disponible = params.Disponible === 'true';
      const res = await this.svc.getAtracciones(params);
      this.items = (res.items || []).map((item: any) => ({
        ...item,
        moneda: 'USD'
      }));
      this.totalRecords = res.totalRecords;
      this.totalPages = res.totalPages;
      this.hasPrev = res.hasPreviousPage;
      this.hasNext = res.hasNextPage;
    } catch (e: any) {
      this.error = 'No se pudo cargar las atracciones. Verifica la conexión con el servidor.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  buscar() { this.filtros.PageNumber = 1; this.cargar(); }
  limpiar() { this.filtros = { Ciudad: '', Pais: '', Disponible: '', PageNumber: 1, PageSize: 9 }; this.cargar(); }
  prevPage() { if (this.hasPrev) { this.filtros.PageNumber--; this.cargar(); } }
  nextPage() { if (this.hasNext) { this.filtros.PageNumber++; this.cargar(); } }

  estrellas(n: number): string[] { return Array(5).fill('').map((_,i) => i < n ? '★' : '☆'); }
}