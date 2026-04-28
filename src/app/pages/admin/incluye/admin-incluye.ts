import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IncluyeService, Incluye } from '../../../services/incluye.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-incluye',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-incluye.html',
  styleUrls: ['./admin-incluye.scss']
})
export class AdminIncluyeComponent implements OnInit {
  includes: Incluye[] = [];
  loading = false;
  error = '';

  // Estado del modal de confirmación de eliminación
  confirmDelete: { open: boolean; incluye: Incluye | null; loading: boolean } = {
    open: false,
    incluye: null,
    loading: false
  };

  // Toast notification
  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(private svc: IncluyeService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      this.includes = await this.svc.getAll();
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'No se pudo cargar las inclusiones';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  irACrear() {
    this.router.navigate(['/admin/incluye-forms']);
  }

  irAEditar(id: number) {
    this.router.navigate(['/admin/incluye-forms', id]);
  }

  abrirConfirmDelete(incluye: Incluye) {
    this.confirmDelete = { open: true, incluye, loading: false };
  }

  cerrarConfirmDelete() {
    this.confirmDelete = { open: false, incluye: null, loading: false };
  }

  async confirmarEliminar() {
    if (!this.confirmDelete.incluye) return;
    this.confirmDelete.loading = true;
    try {
      await this.svc.delete(this.confirmDelete.incluye.id);
      this.showToast('Inclusión eliminada correctamente', 'success');
      this.cerrarConfirmDelete();
      await this.cargar();
    } catch (e: any) {
      const msg = e.response?.data?.Message || 'Error al eliminar la inclusión';
      this.showToast(msg, 'error');
      this.confirmDelete.loading = false;
    }
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { visible: true, message, type };
    setTimeout(() => { this.toast.visible = false; }, 3500);
  }
}