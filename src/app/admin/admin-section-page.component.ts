import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { DataService } from '../core/data.service';
import { TabbedApplicationComponent } from '../application/tabbed-application.component';

@Component({
  standalone: true,
  imports: [CommonModule, TabbedApplicationComponent],
  template: `
    <div class="crm-loading" *ngIf="loading">
      <div class="spinner"></div>
      <p>Loading user data...</p>
    </div>
    <app-tabbed-application
      *ngIf="targetUserId && !loading && !error"
      [userId]="targetUserId"
      [canEdit]="true"
      [pageTitle]="targetName + ' - Update Application'"
      [isAdminContext]="true"
      [autoPrint]="autoPrint"
    ></app-tabbed-application>
    <div class="toast error" *ngIf="error">
      <span>⚠️</span>
      <span>{{ error }}</span>
    </div>
  `
})
export class AdminSectionPageComponent implements OnInit {
  targetUserId = '';
  targetName = '';
  error = '';
  loading = true;
  autoPrint = false;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private data: DataService
  ) {}

  async ngOnInit(): Promise<void> {
    const userId = this.route.parent?.snapshot.paramMap.get('id')
                || this.route.snapshot.paramMap.get('id')
                || '';
    const admin = await this.auth.waitForReadyProfile();

    if (!admin?.id || admin.role !== 'admin' || !userId) {
      this.error = 'Invalid admin request.';
      this.loading = false;
      return;
    }

    const res = await this.data.getTenantUser(admin.id, userId);
    if (res.error) {
      this.error = res.error;
      this.loading = false;
      return;
    }
    if (!res.data) {
      this.error = 'User not in your tenant scope.';
      this.loading = false;
      return;
    }

    this.targetUserId = userId;
    this.targetName = res.data.full_name;
    this.autoPrint = this.route.snapshot.queryParamMap.get('print') === 'true';
    this.loading = false;
  }
}
