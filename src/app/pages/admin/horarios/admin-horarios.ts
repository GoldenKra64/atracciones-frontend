import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HorarioService, Horario } from '../../../services/horario.service';

@Component({
  selector: 'app-admin-horarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-horarios.html',
  styleUrls: ['./admin-horarios.scss']
})
export class AdminHorariosComponent implements OnInit {
  horarios: Horario[] = [];
  loading = false;
  error = '';

  confirmDelete: { open: boolean; horario: Horario | null; loading: boolean } = {
    open: false,
    horario: null,
    loading: false
  };

  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(private svc: HorarioService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      this.horarios = await this.svc.getAll();
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'No se pudo cargar los horarios';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  irACrear() {
    this.router.navigate(['/admin/horarios-forms']);
  }

  irAEditar(guid: string) {
    this.router.navigate(['/admin/horarios-forms', guid]);
  }

  abrirConfirmDelete(horario: Horario) {
    this.confirmDelete = { open: true, horario, loading: false };
  }

  cerrarConfirmDelete() {
    this.confirmDelete = { open: false, horario: null, loading: false };
  }

  async confirmarEliminar() {
    if (!this.confirmDelete.horario) return;
    this.confirmDelete.loading = true;
    try {
      await this.svc.delete(this.confirmDelete.horario.horarioId);
      this.showToast('Horario eliminado correctamente', 'success');
      this.cerrarConfirmDelete();
      await this.cargar();
    } catch (e: any) {
      const msg = e.response?.data?.Message || 'Error al eliminar el horario';
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
