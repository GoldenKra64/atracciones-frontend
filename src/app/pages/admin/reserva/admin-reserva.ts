import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReservaService, Reserva } from '../../../services/reserva.service';

@Component({
  selector: 'app-admin-reserva',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-reserva.html',
  styleUrls: ['./admin-reserva.scss']
})
export class AdminReservaComponent implements OnInit {
  reservas: Reserva[] = [];
  loading = false;
  error = '';
  approving: string | null = null;

  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(private svc: ReservaService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      const allReservas = await this.svc.getAll();
      this.reservas = allReservas.filter(r => r.rev_estado === 'PEN');
    } catch (e: any) {
      this.error = e.response?.data?.message || 'No se pudo cargar las reservas';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  irACrear() {
    this.router.navigate(['/admin/reserva-forms']);
  }

  irAEditar(guid: string) {
    this.router.navigate(['/admin/reserva-forms', guid]);
  }

  async aprobarReserva(guid: string) {
    this.approving = guid;
    try {
      await this.svc.approve(guid);
      this.showToast('Reserva aprobada correctamente', 'success');
      await this.cargar();
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Error al aprobar la reserva';
      this.showToast(msg, 'error');
    } finally {
      this.approving = null;
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
