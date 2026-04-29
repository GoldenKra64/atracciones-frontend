import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AtraccionesService, AtraccionItem } from '../../../services/atracciones.service';

@Component({
  selector: 'app-admin-atracciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-atracciones.html',
  styleUrls: ['./admin-atracciones.scss']
})
export class AdminAtraccionesComponent implements OnInit {
  atracciones: AtraccionItem[] = [];
  loading = false;
  error = '';

  // Paginación
  pageNumber = 1;
  pageSize = 20;
  totalPages = 1;
  totalRecords = 0;

  confirmDelete: { open: boolean; atraccion: AtraccionItem | null; loading: boolean } = {
    open: false,
    atraccion: null,
    loading: false
  };

  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(private svc: AtraccionesService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar(page: number = 1) {
    this.loading = true;
    this.error = '';
    this.pageNumber = page;
    try {
      const data = await this.svc.getAtracciones({ Page: this.pageNumber, Limit: this.pageSize });
      this.atracciones = data.items;
      this.totalRecords = data.totalRecords;
      this.totalPages = data.totalPages;
    } catch (e: any) {
      this.error = e.response?.data?.message || 'No se pudo cargar las atracciones';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
      this.cargar(nuevaPagina);
    }
  }

  irACrear() {
    this.router.navigate(['/admin/atracciones-forms']);
  }

  irAEditar(id: string) {
    this.router.navigate(['/admin/atracciones-forms', id]);
  }

  abrirConfirmDelete(atraccion: AtraccionItem) {
    this.confirmDelete = { open: true, atraccion, loading: false };
  }

  cerrarConfirmDelete() {
    this.confirmDelete = { open: false, atraccion: null, loading: false };
  }

  async confirmarEliminar() {
    if (!this.confirmDelete.atraccion) return;
    this.confirmDelete.loading = true;
    try {
      await this.svc.delete(this.confirmDelete.atraccion.id);
      this.showToast('Atracción eliminada correctamente', 'success');
      this.cerrarConfirmDelete();
      await this.cargar(this.pageNumber);
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Error al eliminar la atracción';
      this.showToast(msg, 'error');
      this.confirmDelete.loading = false;
      this.cdr.detectChanges();
    }
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { visible: true, message, type };
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toast.visible = false;
      this.cdr.detectChanges();
    }, 3500);
  }
}
