import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import api from './api.service';

export interface AuthUser { username: string; token: string; expiration: string; roles: string[]; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<AuthUser | null>(
    JSON.parse(localStorage.getItem('atraxia_user') || 'null')
  );
  currentUser$ = this.userSubject.asObservable();
  get currentUser() { return this.userSubject.value; }
  get isLoggedIn() { return !!this.userSubject.value; }

  async login(payload: { login: string; password: string }) {
    try {
      const res = await api.post('/Auth/login', payload);
      const data = res.data?.data;
      if (data?.success && data?.token) {
        const user: AuthUser = { username: data.username, token: data.token, expiration: data.expiration, roles: data.roles || [] };
        localStorage.setItem('atraxia_token', data.token);
        localStorage.setItem('atraxia_user', JSON.stringify(user));
        this.userSubject.next(user);
        return { success: true, message: `Bienvenido, ${data.username}` };
      }
      return { success: false, message: data?.message || 'Credenciales incorrectas' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Error al iniciar sesión' };
    }
  }

  async register(payload: any) {
    try {
      const res = await api.post('/Auth', payload);
      return res.data?.success
        ? { success: true, message: 'Cuenta creada. Ya puedes ingresar.' }
        : { success: false, message: res.data?.message || 'Error al registrarse' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Error al registrarse' };
    }
  }

  logout() {
    localStorage.removeItem('atraxia_token');
    localStorage.removeItem('atraxia_user');
    this.userSubject.next(null);
  }
}