import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ImagenService, Imagen } from '../../../services/imagen.service';

@Component({
  selector: 'app-admin-imagen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-imagen.html',
  styleUrls: ['./admin-imagen.scss']
})
export class AdminImagenComponent implements OnInit {
  imagenes: Imagen[] = [];
  loading = false;
  error = '';

  confirmDelete: { open: boolean; imagen: Imagen | null; loading: boolean } = {
    open: false,
    imagen: null,
    loading: false
  };

  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(private svc: ImagenService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      this.imagenes = await this.svc.getAll();
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'No se pudo cargar las imagenes';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  irACrear() {
    this.router.navigate(['/admin/imagen-forms']);
  }

  irAEditar(id: number) {
    this.router.navigate(['/admin/imagen-forms', id]);
  }

  abrirConfirmDelete(imagen: Imagen) {
    this.confirmDelete = { open: true, imagen, loading: false };
  }

  cerrarConfirmDelete() {
    this.confirmDelete = { open: false, imagen: null, loading: false };
  }

  async confirmarEliminar() {
    if (!this.confirmDelete.imagen) return;
    this.confirmDelete.loading = true;
    try {
      await this.svc.delete(this.confirmDelete.imagen.id);
      this.showToast('Imagen eliminada correctamente', 'success');
      this.cerrarConfirmDelete();
      await this.cargar();
    } catch (e: any) {
      const msg = e.response?.data?.Message || 'Error al eliminar la imagen';
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
