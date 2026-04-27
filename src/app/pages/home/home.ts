import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  features = [
    { icon: '🗺️', title: 'Destinos Únicos', desc: 'Descubre atracciones fuera de lo común en toda Latinoamérica.' },
    { icon: '🎟️', title: 'Reserva Fácil', desc: 'Compra tickets en segundos y recíbelos directamente en tu correo.' },
    { icon: '⭐', title: 'Calidad Garantizada', desc: 'Todas nuestras experiencias son evaluadas por viajeros reales.' },
    { icon: '🌍', title: 'Guías Locales', desc: 'Conecta con expertos locales que conocen cada rincón.' }
  ];
}