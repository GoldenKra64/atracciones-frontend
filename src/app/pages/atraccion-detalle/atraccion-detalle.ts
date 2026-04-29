import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtraccionesService, AtraccionDetalle, ResenaItem } from '../../services/atracciones.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-atraccion-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './atraccion-detalle.html',
  styleUrls: ['./atraccion-detalle.scss']
})
export class AtraccionDetalleComponent implements OnInit {
  atraccion: AtraccionDetalle | null = null;
  loading = false;
  error = '';
  selectedImg = 0;


  horarioSeleccionado: any = null;
  cantidades: { [tckGuid: string]: number } = {};
  reserving = false;
  modalMsg = '';
  modalSuccess = false;
  showModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: AtraccionesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.cargar(id);
  }

  async cargar(id: string) {
    this.loading = true;
    this.error = '';
    try {
      this.atraccion = await this.svc.getAtraccion(id);
    } catch {
      this.error = 'No se pudo cargar los detalles de esta atracción.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }


  seleccionarHorario(h: any) {
    this.horarioSeleccionado = h;
    this.cantidades = {};
    this.getTicketsPorHorario().forEach(t => this.cantidades[t.tckGuid] = 0);
  }

  getTicketsPorHorario() {
    if (!this.atraccion || !this.horarioSeleccionado) return [];
    return this.atraccion.tickets.filter(t => t.horId === this.horarioSeleccionado.horarioId);
  }

  incrementar(tckGuid: string) {
    this.cantidades[tckGuid] = (this.cantidades[tckGuid] || 0) + 1;
  }

  decrementar(tckGuid: string) {
    if (this.cantidades[tckGuid] > 0) {
      this.cantidades[tckGuid]--;
    }
  }

  get totalTickets() {
    return Object.values(this.cantidades).reduce((a, b) => a + b, 0);
  }

  async reservar() {
    if (!this.horarioSeleccionado || this.totalTickets === 0) return;
    const token = localStorage.getItem('atraxia_token');
    if (!token) {
      this.router.navigate(['/ingresar']);
      return;
    }

    this.reserving = true;
    const lineas = Object.entries(this.cantidades)
      .filter(([_, qty]) => qty > 0)
      .map(([tck_guid, cantidad]) => ({ tck_guid, cantidad }));

    const payload = {
      hor_guid: this.horarioSeleccionado.horarioGuid,
      origen_canal: 'ATRAXIA',
      lineas
    };

    try {
      const res = await this.svc.reservar(payload);
      console.log(res);
      this.modalSuccess = res.success !== false;
      this.modalMsg = res.message || 'Reserva procesada exitosamente';
    } catch (e: any) {
      this.modalSuccess = false;
      this.modalMsg = e.response?.message || 'Error al procesar la reserva';
    } finally {
      this.reserving = false;
      this.showModal = true;
      this.cdr.detectChanges();
    }

    this.cargar(this.atraccion?.id || '');
  }

  cerrarModal() {
    this.showModal = false;
    if (this.modalSuccess) {
      this.horarioSeleccionado = null;
      this.cantidades = {};
    }
  }
}