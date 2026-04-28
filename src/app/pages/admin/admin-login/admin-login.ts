import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.scss']
})
export class AdminLoginComponent {
  credentials = { login: '', password: '' };
  loading = false;
  error = '';
  showPassword = false;

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    // Si ya es admin, redirigir al dashboard
    if (this.auth.isAdmin) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  async onSubmit() {
    if (!this.credentials.login || !this.credentials.password) {
      this.error = 'Completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    const res = await this.auth.adminLogin(this.credentials);

    this.loading = false;


    if (res.success) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.error = res.message;
    }
    this.cdr.detectChanges();
  }
}