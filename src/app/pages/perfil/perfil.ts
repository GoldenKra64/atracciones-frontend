import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteService, ClienteProfile, FacturaItem } from '../../services/cliente.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.scss']
})
export class PerfilComponent implements OnInit {
  profile: ClienteProfile | null = null;
  facturas: FacturaItem[] = [];
  loading = false;
  error = '';
  
  constructor(private svc: ClienteService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    const token = localStorage.getItem('atraxia_token');
    if (!token) {
      this.router.navigate(['/ingresar']);
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      this.profile = await this.svc.getProfile();
      const facturasData = await this.svc.getFacturas(1, 20);
      this.facturas = facturasData.items || [];
    } catch (err: any) {
      this.error = 'No se pudieron cargar los datos del perfil.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
