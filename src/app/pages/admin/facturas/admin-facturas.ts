import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FacturaService, FacturaAdmin } from '../../../services/factura.service';

@Component({
  selector: 'app-admin-facturas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-facturas.html',
  styleUrls: ['./admin-facturas.scss']
})
export class AdminFacturasComponent implements OnInit {
  facturas: FacturaAdmin[] = [];
  loading = false;
  error = '';

  constructor(private svc: FacturaService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.loading = true;
    this.error = '';
    try {
      this.facturas = await this.svc.getAllAdmin();
    } catch (e: any) {
      this.error = e.response?.data?.Message || 'No se pudo cargar las facturas';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
