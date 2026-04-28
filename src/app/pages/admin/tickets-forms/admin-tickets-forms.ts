import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService, TicketPayload, HorarioOption } from '../../../services/ticket.service';

@Component({
  selector: 'app-admin-tickets-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-tickets-forms.html',
  styleUrls: ['./admin-tickets-forms.scss']
})
export class AdminTicketsFormsComponent implements OnInit {
  isEdit = false;
  ticketId: number | null = null;
  loading = false;
  saving = false;
  error = '';
  validationErrors: string[] = [];
  toast = { visible: false, message: '', type: 'success' as 'success' | 'error' };

  horarios: HorarioOption[] = [];

  payload: TicketPayload = {
    horarioId: 0,
    nombre: '',
    precio: 0,
    tipo: 'JUNIOR'
  };

  tipos = ['JUNIOR', 'YOUNG ADULT', 'SENIOR', 'CARETAKER', 'ELDER'];

  constructor(
    private svc: TicketService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  async cargarDatosIniciales() {
    this.loading = true;
    try {
      this.horarios = await this.svc.getHorarios();
      if (this.horarios.length > 0) {
        this.payload.horarioId = this.horarios[0].horarioId;
      }

      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.isEdit = true;
          this.ticketId = Number(idParam);
          this.cargarTicket(this.ticketId);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } catch (e: any) {
      this.error = 'Error al cargar los horarios';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async cargarTicket(id: number) {
    try {
      const ticket = await this.svc.getById(id);
      this.payload.horarioId = ticket.horarioId;
      this.payload.nombre = ticket.nombre;
      this.payload.precio = ticket.precio;
      this.payload.tipo = ticket.tipo;
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'Error al cargar el ticket';
      this.showToast(this.error, 'error');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async guardar() {
    this.error = '';
    this.validationErrors = [];

    // Ensure numeric values
    this.payload.horarioId = Number(this.payload.horarioId);
    this.payload.precio = Number(this.payload.precio);

    if (!this.payload.horarioId || !this.payload.nombre || this.payload.precio < 0 || !this.payload.tipo) {
      this.error = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    this.saving = true;
    try {
      if (this.isEdit && this.ticketId) {
        await this.svc.update(this.ticketId, this.payload);
        this.showToast('Ticket actualizado', 'success');
      } else {
        await this.svc.create(this.payload);
        this.showToast('Ticket creado', 'success');
      }
      setTimeout(() => {
        this.router.navigate(['/admin/tickets']);
      }, 1500);
    } catch (e: any) {
      const data = e.response?.data;
      if (data && data.Errors) {
        this.validationErrors = data.Errors;
      } else {
        this.error = data?.Message || 'Ocurrió un error al guardar';
      }
      this.showToast('Error al guardar', 'error');
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  getHorarioLabel(h: HorarioOption): string {
    return `${h.fecha} ${h.horaInicio}-${h.horaFin || 'N/A'} (Atracción: ${h.atraccionId})`;
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
