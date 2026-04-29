import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

interface DashboardCard {
  emoji: string;
  accentEmoji: string;
  titulo: string;
  descripcion: string;
  color: string;
  route: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent implements OnInit {
  adminUsername = '';

  cards: DashboardCard[] = [
    {
      emoji: '🗺️',
      accentEmoji: '📍',
      titulo: 'Destinos',
      descripcion: 'Gestiona los destinos turísticos disponibles en la plataforma',
      color: '#4A9EFF',
      route: '/admin/destinos'
    },
    {
      emoji: '🎡',
      accentEmoji: '🎟️',
      titulo: 'Atracciones',
      descripcion: 'Administra tours, actividades y experiencias disponibles',
      color: '#FFB432',
      route: '/admin/atracciones'
    },
    {
      emoji: '👥',
      accentEmoji: '🪪',
      titulo: 'Clientes',
      descripcion: 'Consulta y administra los usuarios registrados en el sistema',
      color: '#A78BFA',
      route: '/admin/clientes'
    },
    {
      emoji: '📋',
      accentEmoji: '✅',
      titulo: 'Reservas',
      descripcion: 'Revisa y gestiona todas las reservas activas y pasadas',
      color: '#34D399',
      route: '/admin/reserva'
    },
    {
      emoji: '🧾',
      accentEmoji: '💰',
      titulo: 'Facturas',
      descripcion: 'Accede al historial de facturación y documentos financieros',
      color: '#F472B6',
      route: '/admin/facturas'
    },
    {
      emoji: '⏰',
      accentEmoji: '🗓️',
      titulo: 'Horarios',
      descripcion: 'Gestiona los horarios de cada atracción',
      color: '#4A9EFF',
      route: '/admin/horarios'
    },
    {
      emoji: '🎫',
      accentEmoji: '🎟️',
      titulo: 'Tickets',
      descripcion: 'Gestiona los tickets de cada atracción',
      color: '#FFB432',
      route: '/admin/tickets'
    },
    {
      emoji: '✅',
      accentEmoji: '✓',
      titulo: 'Incluye',
      descripcion: 'Gestiona lo que incluye una atracción',
      color: '#00FF26',
      route: '/admin/incluye'
    },
    {
      emoji: '🚫',
      accentEmoji: '⛔',
      titulo: 'No Incluye',
      descripcion: 'Gestiona lo que no incluye una atracción',
      color: '#FA2C2C',
      route: '/admin/noincluye'
    },
    {
      emoji: '🖼️',
      accentEmoji: '🖼️',
      titulo: 'Imágenes',
      descripcion: 'Gestiona las imágenes de una atracción',
      color: '#f0821e',
      route: '/admin/imagen'
    }
  ];

  constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.adminUsername = this.auth.adminUsername;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.auth.adminLogout();
    this.router.navigate(['/admin/login']);
  }
}