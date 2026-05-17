import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-ingresar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingresar.html',
  styleUrls: ['./ingresar.scss']
})
export class IngresarComponent {
  tab: 'login' | 'registro' = 'login';
  loading = false;
  mensaje = '';
  esError = false;

  login = { login: '', password: '' };

  registro = {
    login: '', password: '',
    rolIds: [2],
    cliente: {
      usuarioId: 0, tipoIdentificacion: 'CEDULA', numeroIdentificacion: '',
      correo: '', nombres: '', apellidos: '', telefono: '', direccion: ''
    }
  };

  constructor(private auth: AuthService, private router: Router, private cdRef: ChangeDetectorRef) { }

  async onLogin() {
    if (!this.login.login || !this.login.password) {
      this.esError = true; this.mensaje = 'Completa todos los campos'; return;
    }
    this.loading = true; this.mensaje = '';
    const res = await this.auth.login(this.login);
    this.loading = false;
    if (res.success) { this.router.navigate(['/atracciones']); }
    else { this.esError = true; this.mensaje = res.message; }

    this.cdRef.detectChanges();
  }

  async onRegistro() {
    this.loading = true; this.mensaje = '';
    const res: any = await this.auth.register(this.registro);
    this.loading = false;
    this.esError = !res.success;

    if (res.success) {
      this.mensaje = res.message;
      this.tab = 'login';
    } else {
      let errorMsg = res.message;
      if (res.errors && res.errors.length > 0) {
        errorMsg += ` ${res.errors.join(' | ')}`;
      }
      this.mensaje = errorMsg;
    }
    this.cdRef.detectChanges();
  }
}