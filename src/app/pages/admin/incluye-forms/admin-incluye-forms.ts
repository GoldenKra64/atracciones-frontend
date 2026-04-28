import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { IncluyeService, IncluyePayload } from '../../../services/incluye.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-incluye-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-incluye-forms.html',
  styleUrls: ['./admin-incluye-forms.scss']
})
export class AdminIncluyeFormsComponent implements OnInit {
  isEdit = false;
  incluyeId: number | null = null;
  loading = false;
  saving = false;
  error = '';
  validationErrors: string[] = [];
  toast = { visible: false, message: '', type: 'success' as 'success' | 'error' };

  payload: IncluyePayload = {
    descripcion: '',
  };

  constructor(
    private svc: IncluyeService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.incluyeId = parseInt(idParam, 10);
        this.cargarIncluye(this.incluyeId);
      }
    });
  }

  async cargarIncluye(id: number) {
    this.loading = true;
    try {
      const incluye = await this.svc.getById(id);
      this.payload.descripcion = incluye.descripcion;
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'Error al cargar la inclusión';
      this.showToast(this.error, 'error');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async guardar() {
    this.error = '';
    this.validationErrors = [];

    if (!this.payload.descripcion) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.saving = true;
    try {
      if (this.isEdit && this.incluyeId) {
        await this.svc.update(this.incluyeId, this.payload);
        this.showToast('Inclusión actualizada', 'success');
      } else {
        await this.svc.create(this.payload);
        this.showToast('Inclusión creada', 'success');
      }
      setTimeout(() => {
        this.router.navigate(['/admin/incluye']);
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