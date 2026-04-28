import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NoIncluyeService, NoIncluye } from '../../../services/noincluye.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-noincluye',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-noincluye.html',
  styleUrls: ['./admin-noincluye.scss']
})
export class AdminNoIncluyeComponent implements OnInit {
  noIncluye: NoIncluye[] = [];
  loading = false;
  error = '';

  // Estado del modal de confirmación de eliminación
  confirmDelete: { open: boolean; noIncluye: NoIncluye | null; loading: boolean } = {
    open: false,
    noIncluye: null,
    loading: false
  };

  // Toast notification
  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(private svc: NoIncluyeService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      this.noIncluye = await this.svc.getAll();
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'No se pudo cargar las inclusiones';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  irACrear() {
    this.router.navigate(['/admin/noincluye-forms']);
  }

  irAEditar(id: number) {
    this.router.navigate(['/admin/noincluye-forms', id]);
  }

  abrirConfirmDelete(noIncluye: NoIncluye) {
    this.confirmDelete = { open: true, noIncluye, loading: false };
  }

  cerrarConfirmDelete() {
    this.confirmDelete = { open: false, noIncluye: null, loading: false };
  }

  async confirmarEliminar() {
    if (!this.confirmDelete.noIncluye) return;
    this.confirmDelete.loading = true;
    try {
      await this.svc.delete(this.confirmDelete.noIncluye.id);
      this.showToast('No Incluido eliminado correctamente', 'success');
      this.cerrarConfirmDelete();
      await this.cargar();
    } catch (e: any) {
      const msg = e.response?.data?.Message || 'Error al eliminar el no incluido';
      this.showToast(msg, 'error');
      this.confirmDelete.loading = false;
    }
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { visible: true, message, type };
    setTimeout(() => { this.toast.visible = false; }, 3500);
  }
}