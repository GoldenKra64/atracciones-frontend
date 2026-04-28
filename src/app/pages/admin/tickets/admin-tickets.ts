import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../services/ticket.service';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-tickets.html',
  styleUrls: ['./admin-tickets.scss']
})
export class AdminTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = false;
  error = '';

  confirmDelete: { open: boolean; ticket: Ticket | null; loading: boolean } = {
    open: false,
    ticket: null,
    loading: false
  };

  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(private svc: TicketService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      this.tickets = await this.svc.getAll();
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'No se pudo cargar los tickets';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  irACrear() {
    this.router.navigate(['/admin/tickets-forms']);
  }

  irAEditar(id: number) {
    this.router.navigate(['/admin/tickets-forms', id]);
  }

  abrirConfirmDelete(ticket: Ticket) {
    this.confirmDelete = { open: true, ticket, loading: false };
  }

  cerrarConfirmDelete() {
    this.confirmDelete = { open: false, ticket: null, loading: false };
  }

  async confirmarEliminar() {
    if (!this.confirmDelete.ticket) return;
    this.confirmDelete.loading = true;
    try {
      await this.svc.delete(this.confirmDelete.ticket.id);
      this.showToast('Ticket eliminado correctamente', 'success');
      this.cerrarConfirmDelete();
      await this.cargar();
    } catch (e: any) {
      const msg = e.response?.data?.Message || 'Error al eliminar el ticket';
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
