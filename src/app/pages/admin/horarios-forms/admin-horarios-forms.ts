import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HorarioService, HorarioPayload, AtraccionType } from '../../../services/horario.service';

@Component({
  selector: 'app-admin-horarios-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-horarios-forms.html',
  styleUrls: ['./admin-horarios-forms.scss']
})
export class AdminHorariosFormsComponent implements OnInit {
  isEdit = false;
  horarioGuid: string | null = null;
  loading = false;
  saving = false;
  error = '';
  validationErrors: string[] = [];
  toast = { visible: false, message: '', type: 'success' as 'success' | 'error' };

  atracciones: AtraccionType[] = [];

  payload: HorarioPayload = {
    atraccionId: 0,
    fecha: '',
    horaInicio: '',
    horaFin: '',
    cupos: 0
  };

  constructor(
    private svc: HorarioService,
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
      this.atracciones = await this.svc.getAtraccionesType();
      if (this.atracciones.length > 0) {
        this.payload.atraccionId = this.atracciones[0].id;
      }

      this.route.paramMap.subscribe(params => {
        const guidParam = params.get('guid');
        if (guidParam) {
          this.isEdit = true;
          this.horarioGuid = guidParam;
          this.cargarHorario(this.horarioGuid);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } catch (e: any) {
      this.error = 'Error al cargar los tipos de atracciones';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async cargarHorario(guid: string) {
    try {
      const horario = await this.svc.getById(guid);
      this.payload.atraccionId = horario.atraccionId;
      this.payload.fecha = horario.fecha; 
      this.payload.horaInicio = horario.horaInicio;
      this.payload.horaFin = horario.horaFin || '';
      this.payload.cupos = horario.cupos;
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'Error al cargar el horario';
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
    this.payload.atraccionId = Number(this.payload.atraccionId);
    this.payload.cupos = Number(this.payload.cupos);

    if (!this.payload.atraccionId || !this.payload.fecha || !this.payload.horaInicio || this.payload.cupos < 0) {
      this.error = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    this.saving = true;
    try {
      if (this.isEdit && this.horarioGuid) {
        await this.svc.update(this.horarioGuid, this.payload);
        this.showToast('Horario actualizado', 'success');
      } else {
        await this.svc.create(this.payload);
        this.showToast('Horario creado', 'success');
      }
      setTimeout(() => {
        this.router.navigate(['/admin/horarios']);
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

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { visible: true, message, type };
    this.cdr.detectChanges();
    setTimeout(() => { 
        this.toast.visible = false; 
        this.cdr.detectChanges();
    }, 3500);
  }
}
