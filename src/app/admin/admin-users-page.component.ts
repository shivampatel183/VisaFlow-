import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { DataService } from '../core/data.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  template: `
    <section class="crm-content-header">
      <div class="crm-header-row">
        <h1>Manage Users</h1>
      </div>
    </section>

    <!-- Toast Messages -->
    <div class="toast error" *ngIf="error" style="margin: 0 20px 12px;">
      <span>⚠️</span>
      <span>{{ error }}</span>
    </div>
    <div class="toast success" *ngIf="success" style="margin: 0 20px 12px;">
      <span>✅</span>
      <span>{{ success }}</span>
    </div>

    <!-- Users List Card -->
    <div class="crm-card">
      <div class="crm-card-header" style="padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <h3 style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--text);">Users List</h3>
          <span class="crm-badge" *ngIf="!loadingUsers">{{ users.length }} user(s)</span>
        </div>
        <button class="crm-btn crm-btn-primary crm-btn-sm" (click)="openModal()">
          <span>＋</span> Add Users
        </button>
      </div>

      <!-- Search Bar -->
      <div style="padding: 12px 20px; border-bottom: 1px solid var(--border);" *ngIf="!loadingUsers && users.length">
        <input class="crm-input" type="text" placeholder="🔍 Search by name or email..." [(ngModel)]="searchTerm" style="max-width: 360px;" />
      </div>

      <div class="crm-card-body" style="padding: 0;">
        <!-- Loading State -->
        <div class="crm-loading" *ngIf="loadingUsers" style="padding: 40px;">
          <div class="spinner"></div>
          <p>Loading Users...</p>
        </div>

        <ng-container *ngIf="!loadingUsers">
          <!-- User Table -->
          <div class="crm-table-wrapper" *ngIf="users.length; else emptyState">
            <table class="crm-table">
              <thead>
                <tr>
                  <th style="width: 50px;">#</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>User ID</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of filteredUsers; let i = index">
                  <td>
                    <div class="user-avatar-sm">{{ getInitial(user.full_name) }}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600;">{{ user.full_name }}</div>
                  </td>
                  <td>
                    <span style="font-size: 0.82rem; color: var(--text-muted);">{{ user.email || '—' }}</span>
                  </td>
                  <td>
                    <span class="crm-id-badge">{{ user.id | slice:0:8 }}...</span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                      <a [routerLink]="['/admin/user', user.id]" class="crm-btn crm-btn-primary crm-btn-sm" style="text-decoration:none;">
                        Open & Edit →
                      </a>
                      <a [routerLink]="['/admin/user', user.id]" [queryParams]="{print: true}" class="crm-btn crm-btn-default crm-btn-sm" style="text-decoration:none;" title="Print Application">
                        🖨️
                      </a>
                      <button *ngIf="confirmingDeleteId !== user.id" class="crm-btn crm-btn-danger crm-btn-sm"
                              (click)="confirmingDeleteId = user.id" type="button">
                        🗑
                      </button>
                      <ng-container *ngIf="confirmingDeleteId === user.id">
                        <span style="font-size: 0.78rem; color: var(--danger);">Delete?</span>
                        <button class="crm-btn crm-btn-danger crm-btn-sm" (click)="deleteUser(user)" type="button" [disabled]="deleting">
                          {{ deleting ? '...' : 'Yes' }}
                        </button>
                        <button class="crm-btn crm-btn-default crm-btn-sm" (click)="confirmingDeleteId = ''" type="button">
                          No
                        </button>
                      </ng-container>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #emptyState>
            <div class="crm-empty" style="padding: 60px 20px;">
              <div style="font-size: 3rem; margin-bottom: 12px; opacity: 0.3;">👤</div>
              <p style="margin: 0;">No Users found. Click <strong>+ Add User</strong> to create one.</p>
            </div>
          </ng-template>
        </ng-container>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div class="crm-modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="crm-modal" (click)="$event.stopPropagation()">
        <div class="crm-modal-header">
          <h3>Add New User</h3>
          <button class="crm-modal-close" (click)="closeModal()">✕</button>
        </div>
        <div class="crm-modal-body">
          <form [formGroup]="createForm" (ngSubmit)="createUser()" id="createUserForm">
            <div class="crm-form-stack">
              <div class="crm-form-group">
                <label class="crm-label">Full Name <span class="text-danger">*</span></label>
                <input class="crm-input" type="text" formControlName="fullName" placeholder="Enter User full name" />
              </div>
              <div class="crm-form-group">
                <label class="crm-label">Email <span class="text-danger">*</span></label>
                <input class="crm-input" type="email" formControlName="email" placeholder="user@example.com" />
              </div>
              <div class="crm-form-group">
                <label class="crm-label">Password <span class="text-danger">*</span></label>
                <input class="crm-input" type="password" formControlName="password" placeholder="Min 6 characters" />
              </div>
            </div>
          </form>
        </div>
        <div class="crm-modal-footer">
          <button class="crm-btn crm-btn-default" type="button" (click)="closeModal()">Cancel</button>
          <button class="crm-btn crm-btn-primary" type="submit" form="createUserForm" [disabled]="creating || createForm.invalid">
            <span *ngIf="creating" class="spinner" style="width:14px;height:14px;border-width:2px;"></span>
            {{ creating ? 'Creating...' : 'Create User' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersPageComponent implements OnInit {
  users: Array<{ id: string; full_name: string; email?: string }> = [];
  error = '';
  success = '';
  creating = false;
  searchTerm = '';
  deleting = false;
  loadingUsers = true;
  adminId = '';
  showModal = false;
  confirmingDeleteId = '';
  readonly createForm: UntypedFormGroup;

  constructor(private auth: AuthService, private data: DataService, private fb: FormBuilder) {
    this.createForm = this.fb.nonNullable.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get filteredUsers() {
    if (!this.searchTerm.trim()) return this.users;
    const q = this.searchTerm.toLowerCase().trim();
    return this.users.filter(u =>
      u.full_name.toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }

  async ngOnInit(): Promise<void> {
    const profile = await this.auth.waitForReadyProfile();
    if (!profile?.id || profile.role !== 'admin') {
      this.error = 'Admin session not found.';
      this.loadingUsers = false;
      return;
    }
    this.adminId = profile.id;
    await this.loadUsers();
  }

  getInitial(name: string): string {
    return (name?.[0] ?? '?').toUpperCase();
  }

  openModal(): void {
    this.showModal = true;
    this.createForm.reset({ fullName: '', email: '', password: '' });
  }

  closeModal(): void {
    this.showModal = false;
  }

  async createUser(): Promise<void> {
    if (this.createForm.invalid || this.creating || !this.adminId) return;

    this.creating = true;
    this.error = '';
    this.success = '';

    const value = this.createForm.getRawValue();
    const res = await this.auth.adminCreateUser(value.email, value.password, this.adminId, value.fullName);

    this.creating = false;
    if (res.error) {
      this.error = res.error;
      return;
    }

    this.success = `User "${value.fullName}" created successfully.`;
    this.showModal = false;
    this.createForm.reset({ fullName: '', email: '', password: '' });
    await this.loadUsers();
    setTimeout(() => { this.success = ''; }, 4000);
  }

  async deleteUser(user: { id: string; full_name: string }): Promise<void> {
    if (this.deleting || !this.adminId) return;
    this.deleting = true;
    this.error = '';
    this.success = '';

    const res = await this.data.deleteUser(this.adminId, user.id);
    this.deleting = false;
    this.confirmingDeleteId = '';

    if (res.error) {
      this.error = res.error;
      return;
    }

    this.success = `User "${user.full_name}" deleted successfully.`;
    await this.loadUsers();
    setTimeout(() => { this.success = ''; }, 4000);
  }

  private async loadUsers(): Promise<void> {
    this.loadingUsers = true;
    const res = await this.data.getTenantUsers(this.adminId);
    this.loadingUsers = false;
    if (res.error) {
      this.error = res.error;
      return;
    }
    this.users = res.data;
  }
}
