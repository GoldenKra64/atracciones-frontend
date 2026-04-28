import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClienteService, ClientePayload } from '../../../services/cliente.service';

@Component({
  selector: 'app-admin-clientes-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-clientes-forms.html',
  styleUrls: ['./admin-clientes-forms.scss']
})
export class AdminClientesFormsComponent implements OnInit {
  isEdit = false;
  clienteId: number | null = null;
  loading = false;
  saving = false;
  error = '';
  validationErrors: string[] = [];
  toast = { visible: false, message: '', type: 'success' as 'success' | 'error' };

  payload: ClientePayload = {
    tipoIdentificacion: 'CEDULA',
    numeroIdentificacion: '',
    correo: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: ''
  };

  constructor(
    private svc: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.clienteId = parseInt(idParam, 10);
        this.cargarCliente(this.clienteId);
      }
    });
  }

  async cargarCliente(id: number) {
    this.loading = true;
    try {
      const cliente = await this.svc.getById(id);
      this.payload.tipoIdentificacion = (cliente as any).tipoIdentificacion || 'CEDULA'; 
      this.payload.numeroIdentificacion = cliente.numeroIdentificacion;
      this.payload.correo = cliente.correo;
      this.payload.nombres = cliente.nombres;
      this.payload.apellidos = cliente.apellidos;
      this.payload.telefono = cliente.telefono;
      this.payload.direccion = cliente.direccion;
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'Error al cargar el cliente';
      this.showToast(this.error, 'error');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async guardar() {
    this.error = '';
    this.validationErrors = [];

    // Validacion frontend básica de correo
    if (this.payload.correo && !this.payload.correo.includes('@')) {
        this.error = 'Correo inválido, debe contener el símbolo @';
        return;
    }

    if (!this.payload.tipoIdentificacion || !this.payload.numeroIdentificacion || !this.payload.nombres || !this.payload.apellidos || !this.payload.correo) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.saving = true;
    try {
      if (this.isEdit && this.clienteId) {
        await this.svc.update(this.clienteId, this.payload);
        this.showToast('Cliente actualizado', 'success');
      } else {
        await this.svc.create(this.payload);
        this.showToast('Cliente creado', 'success');
      }
      setTimeout(() => {
        this.router.navigate(['/admin/clientes']);
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
