import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card" *ngIf="auth.profile$ | async as profile">
      <h1>Dashboard</h1>
      <p>Welcome, {{ profile.fullName }}.</p>
      <button (click)="openWorkspace(profile.role)">
        {{ profile.role === 'admin' ? 'Open Admin Panel' : 'Open Application Form' }}
      </button>
    </section>
  `
})
export class LandingPageComponent {
  constructor(public auth: AuthService, private router: Router) {}

  async openWorkspace(role: string | null): Promise<void> {
    await this.router.navigateByUrl(role === 'admin' ? '/admin' : '/app');
  }
}
