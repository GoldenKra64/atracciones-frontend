import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ClienteService, ClienteProfile } from '../../../services/cliente.service';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-clientes.html',
  styleUrls: ['./admin-clientes.scss']
})
export class AdminClientesComponent implements OnInit {
  clientes: ClienteProfile[] = [];
  loading = false;
  error = '';

  confirmDelete: { open: boolean; cliente: ClienteProfile | null; loading: boolean } = {
    open: false,
    cliente: null,
    loading: false
  };

  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(private svc: ClienteService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      this.clientes = await this.svc.getAll();
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'No se pudo cargar los clientes';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  irACrear() {
    this.router.navigate(['/admin/clientes-forms']);
  }

  irAEditar(id: number) {
    this.router.navigate(['/admin/clientes-forms', id]);
  }

  abrirConfirmDelete(cliente: ClienteProfile) {
    this.confirmDelete = { open: true, cliente, loading: false };
  }

  cerrarConfirmDelete() {
    this.confirmDelete = { open: false, cliente: null, loading: false };
  }

  async confirmarEliminar() {
    if (!this.confirmDelete.cliente) return;
    this.confirmDelete.loading = true;
    try {
      await this.svc.delete(this.confirmDelete.cliente.id);
      this.showToast('Cliente eliminado correctamente', 'success');
      this.cerrarConfirmDelete();
      await this.cargar();
    } catch (e: any) {
      const msg = e.response?.data?.Message || 'Error al eliminar el cliente';
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
