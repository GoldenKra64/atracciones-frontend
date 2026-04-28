import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NoIncluyeService, NoIncluyePayload } from '../../../services/noincluye.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-noincluye-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-noincluye-forms.html',
  styleUrls: ['./admin-noincluye-forms.scss']
})
export class AdminNoIncluyeFormsComponent implements OnInit {
  isEdit = false;
  noIncluyeId: number | null = null;
  loading = false;
  saving = false;
  error = '';
  validationErrors: string[] = [];
  toast = { visible: false, message: '', type: 'success' as 'success' | 'error' };

  payload: NoIncluyePayload = {
    descripcion: '',
  };

  constructor(
    private svc: NoIncluyeService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.noIncluyeId = parseInt(idParam, 10);
        this.cargarNoIncluye(this.noIncluyeId);
      }
    });
  }

  async cargarNoIncluye(id: number) {
    this.loading = true;
    try {
      const noIncluye = await this.svc.getById(id);
      this.payload.descripcion = noIncluye.descripcion;
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'Error al cargar el No Incluido';
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
      if (this.isEdit && this.noIncluyeId) {
        await this.svc.update(this.noIncluyeId, this.payload);
        this.showToast('No Incluido actualizado', 'success');
      } else {
        await this.svc.create(this.payload);
        this.showToast('No Incluido creado', 'success');
      }
      setTimeout(() => {
        this.router.navigate(['/admin/noincluye']);
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