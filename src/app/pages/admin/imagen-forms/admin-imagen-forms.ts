import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ImagenService, ImagenPayload, AtraccionType } from '../../../services/imagen.service';

@Component({
  selector: 'app-admin-imagen-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-imagen-forms.html',
  styleUrls: ['./admin-imagen-forms.scss']
})
export class AdminImagenFormsComponent implements OnInit {
  isEdit = false;
  imagenId: number | null = null;
  loading = false;
  saving = false;
  error = '';
  validationErrors: string[] = [];
  toast = { visible: false, message: '', type: 'success' as 'success' | 'error' };

  atracciones: AtraccionType[] = [];

  payload: ImagenPayload = {
    atraccionId: 0,
    descripcion: '',
    url: ''
  };

  constructor(
    private svc: ImagenService,
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
        const idParam = params.get('id');
        if (idParam) {
          this.isEdit = true;
          this.imagenId = Number(idParam);
          this.cargarImagen(this.imagenId);
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

  async cargarImagen(id: number) {
    try {
      const imagen = await this.svc.getById(id);
      this.payload.atraccionId = imagen.atraccionId;
      this.payload.descripcion = imagen.descripcion;
      this.payload.url = imagen.url;
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'Error al cargar la imagen';
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

    if (!this.payload.atraccionId || !this.payload.descripcion || !this.payload.url) {
      this.error = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    this.saving = true;
    try {
      if (this.isEdit && this.imagenId) {
        await this.svc.update(Number(this.imagenId), this.payload);
        this.showToast('Imagen actualizada', 'success');
      } else {
        await this.svc.create(this.payload);
        this.showToast('Imagen creada', 'success');
      }
      setTimeout(() => {
        this.router.navigate(['/admin/imagen']);
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