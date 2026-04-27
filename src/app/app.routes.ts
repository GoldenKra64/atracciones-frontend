import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AtraccionesComponent } from './pages/atracciones/atracciones';
import { AtraccionDetalleComponent } from './pages/atraccion-detalle/atraccion-detalle';
import { IngresarComponent } from './pages/ingresar/ingresar';
import { PerfilComponent } from './pages/perfil/perfil';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'atracciones', component: AtraccionesComponent },
  { path: 'atracciones/:id', component: AtraccionDetalleComponent },
  { path: 'ingresar', component: IngresarComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '**', redirectTo: '' }
];