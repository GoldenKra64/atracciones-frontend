import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DestinoService, DestinoPayload } from '../../../services/destino.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-destino-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-destino-forms.html',
  styleUrls: ['./admin-destino-forms.scss']
})
export class AdminDestinoFormsComponent implements OnInit {
  isEdit = false;
  destinoId: number | null = null;
  loading = false;
  saving = false;
  error = '';
  validationErrors: string[] = [];
  toast = { visible: false, message: '', type: 'success' as 'success' | 'error' };

  payload: DestinoPayload = {
    nombre: '',
    pais: '',
    imagenUrl: ''
  };

  constructor(
    private svc: DestinoService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.destinoId = parseInt(idParam, 10);
        this.cargarDestino(this.destinoId);
      }
    });
  }

  async cargarDestino(id: number) {
    this.loading = true;
    try {
      const destino = await this.svc.getById(id);
      this.payload.nombre = destino.nombre;
      this.payload.pais = destino.pais;
      // Using 'any' since imagenUrl might not be present on Destino interface but is required on payload
      this.payload.imagenUrl = (destino as any).imagenUrl || 'string';
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'Error al cargar el destino';
      this.showToast(this.error, 'error');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async guardar() {
    this.error = '';
    this.validationErrors = [];

    if (!this.payload.nombre || !this.payload.pais) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    if (!this.payload.imagenUrl) {
      this.payload.imagenUrl = 'string';
    }

    this.saving = true;
    try {
      if (this.isEdit && this.destinoId) {
        await this.svc.update(this.destinoId, this.payload);
        this.showToast('Destino actualizado', 'success');
      } else {
        await this.svc.create(this.payload);
        this.showToast('Destino creado', 'success');
      }
      setTimeout(() => {
        this.router.navigate(['/admin/destinos']);
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
    }
    this.cdr.detectChanges();
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast = { visible: true, message, type };
    setTimeout(() => { this.toast.visible = false; }, 3500);
  }
}