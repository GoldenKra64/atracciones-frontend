import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservaService, ReservaPayload } from '../../../services/reserva.service';
import { ClienteService, ClienteProfile } from '../../../services/cliente.service';
import { HorarioService, Horario } from '../../../services/horario.service';
import { TicketService, Ticket } from '../../../services/ticket.service';

@Component({
  selector: 'app-admin-reserva-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-reserva-forms.html',
  styleUrls: ['./admin-reserva-forms.scss']
})
export class AdminReservaFormsComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  saving = false;
  currentGuid: string | null = null;
  estadoReserva: string = 'PEN';

  clientes: ClienteProfile[] = [];
  horarios: Horario[] = [];
  tickets: Ticket[] = [];

  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success'
  };

  constructor(
    private fb: FormBuilder,
    private reservaSvc: ReservaService,
    private clienteSvc: ClienteService,
    private horarioSvc: HorarioService,
    private ticketSvc: TicketService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.cargarDatosDesplegables();

    this.route.paramMap.subscribe(params => {
      const guid = params.get('guid');
      if (guid) {
        this.isEditing = true;
        this.currentGuid = guid;
        this.cargarReserva(guid);
      }
    });
  }

  crearFormulario() {
    this.form = this.fb.group({
      clienteId: ['', Validators.required],
      hor_guid: ['', Validators.required],
      origen_canal: ['Web', Validators.required],
      lineas: this.fb.array([this.crearLineaForm()])
    });
  }

  crearLineaForm(): FormGroup {
    return this.fb.group({
      tck_guid: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  get lineas(): FormArray {
    return this.form.get('lineas') as FormArray;
  }

  agregarLinea() {
    this.lineas.push(this.crearLineaForm());
  }

  removerLinea(index: number) {
    if (this.lineas.length > 1) {
      this.lineas.removeAt(index);
    }
  }

  async cargarDatosDesplegables() {
    try {
      const [clientesData, horariosData, ticketsData] = await Promise.all([
        this.clienteSvc.getAll(),
        this.horarioSvc.getAll(),
        this.ticketSvc.getAll()
      ]);
      this.clientes = clientesData;
      this.horarios = horariosData;
      this.tickets = ticketsData;
      this.cdr.detectChanges();
    } catch (e: any) {
      this.showToast('Error al cargar datos para los selectores', 'error');
    }
  }

  async cargarReserva(guid: string) {
    try {
      const data = await this.reservaSvc.getById(guid);

      this.estadoReserva = data.rev_estado;
      if (this.estadoReserva !== 'PEN') {
        this.form.disable();
      }

      // La API no devuelve clienteId ni hor_guid en el GET, así que intentamos hacer match 
      // o dejamos vacío para que el usuario lo seleccione.

      // Limpiamos las líneas existentes
      while (this.lineas.length !== 0) {
        this.lineas.removeAt(0);
      }

      if (data.detalle && data.detalle.length > 0) {
        data.detalle.forEach(d => {
          const lineaForm = this.fb.group({
            tck_guid: [d.tck_guid, Validators.required],
            cantidad: [d.cantidad, [Validators.required, Validators.min(1)]]
          });
          this.lineas.push(lineaForm);
        });
      } else {
        this.agregarLinea(); // Si no hay detalles, agregamos una vacía
      }

      this.cdr.detectChanges();
    } catch (e: any) {
      this.showToast('Error al cargar la reserva', 'error');
    }
  }

  async guardar() {
    if (this.form.invalid) return;

    this.saving = true;
    const payload: ReservaPayload = {
      clienteId: Number(this.form.value.clienteId),
      hor_guid: this.form.value.hor_guid,
      origen_canal: this.form.value.origen_canal,
      lineas: this.form.value.lineas.map((l: any) => ({
        tck_guid: l.tck_guid,
        cantidad: Number(l.cantidad)
      }))
    };

    try {
      if (this.isEditing) {
        await this.reservaSvc.update(this.currentGuid!, payload);
        this.showToast('Reserva actualizada correctamente', 'success');
      } else {
        await this.reservaSvc.create(payload);
        this.showToast('Reserva creada correctamente', 'success');
      }

      setTimeout(() => {
        this.router.navigate(['/admin/reserva']);
      }, 1500);
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Error al guardar la reserva';
      this.showToast(msg, 'error');
      this.saving = false;
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

  async anularReserva() {
    if (!this.currentGuid) return;
    if (!confirm('¿Está seguro de que desea anular esta reserva? Esta acción no se puede deshacer.')) return;

    try {
      await this.reservaSvc.cancel(this.currentGuid);
      this.showToast('Reserva anulada correctamente', 'success');
      this.estadoReserva = 'CAN';
      this.form.disable();
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Error al anular la reserva';
      this.showToast(msg, 'error');
    }
  }
}