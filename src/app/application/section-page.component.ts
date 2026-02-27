import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth.service';
import { TabbedApplicationComponent } from './tabbed-application.component';

@Component({
  standalone: true,
  imports: [CommonModule, TabbedApplicationComponent],
  template: `
    <div class="crm-loading" *ngIf="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
    <app-tabbed-application
      *ngIf="userId && !loading"
      [userId]="userId"
      [canEdit]="true"
      [pageTitle]="userName + ' - Update Application'"
      [isAdminContext]="false"
    ></app-tabbed-application>
    <div class="toast error" *ngIf="error">
      <span>⚠️</span>
      <span>{{ error }}</span>
    </div>
  `
})
export class SectionPageComponent implements OnInit {
  userId = '';
  userName = '';
  loading = true;
  error = '';

  constructor(private auth: AuthService) {}

  async ngOnInit(): Promise<void> {
    const profile = await this.auth.waitForReadyProfile();
    if (!profile?.id) {
      this.error = 'User session not found.';
      this.loading = false;
      return;
    }
    this.userId = profile.id;
    this.userName = profile.fullName || 'User';
    this.loading = false;
  }
}
