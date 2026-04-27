import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: AuthUser | null = null;
  menuOpen = false;
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit() { this.auth.currentUser$.subscribe(u => this.currentUser = u); }
  logout() { this.auth.logout(); this.router.navigate(['/']); }
  toggleMenu() { this.menuOpen = !this.menuOpen; }
}