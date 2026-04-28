import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DestinoService, Destino } from '../../../services/destino.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-destino',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-destino.html',
  styleUrls: ['./admin-destino.scss']
})
export class AdminDestinoComponent implements OnInit {
  destinos: Destino[] = [];
  loading = false;
  error = '';

  // Estado del modal de confirmación de eliminación
  confirmDelete: { open: boolean; destino: Destino | null; loading: boolean } = {
    open: false,
    destino: null,
    loading: false
  };

  // Toast notification
  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(private svc: DestinoService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      this.destinos = await this.svc.getAll();
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'No se pudo cargar los destinos';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  irACrear() {
    this.router.navigate(['/admin/destino-forms']);
  }

  irAEditar(id: number) {
    this.router.navigate(['/admin/destino-forms', id]);
  }

  abrirConfirmDelete(destino: Destino) {
    this.confirmDelete = { open: true, destino, loading: false };
  }

  cerrarConfirmDelete() {
    this.confirmDelete = { open: false, destino: null, loading: false };
  }

  async confirmarEliminar() {
    if (!this.confirmDelete.destino) return;
    this.confirmDelete.loading = true;
    try {
      await this.svc.delete(this.confirmDelete.destino.id);
      this.showToast('Destino eliminado correctamente', 'success');
      this.cerrarConfirmDelete();
      await this.cargar();
    } catch (e: any) {
      const msg = e.response?.data?.Message || 'Error al eliminar el destino';
      this.showToast(msg, 'error');
      this.confirmDelete.loading = false;
    }
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { visible: true, message, type };
    setTimeout(() => { this.toast.visible = false; }, 3500);
  }
}