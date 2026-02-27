import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SectionEditorComponent } from '../application/section-editor.component';
import { AuthService } from '../core/auth.service';
import { DataService } from '../core/data.service';

@Component({
  standalone: true,
  imports: [CommonModule, SectionEditorComponent],
  template: `
    <section class="card" *ngIf="error">
      <p class="error">{{ error }}</p>
    </section>

    <app-section-editor
      *ngIf="targetUserId && !error"
      [userId]="targetUserId"
      [canEdit]="true"
      [title]="'Admin Edit: ' + targetName"
      subtitle="You can review and update this applicant's data section by section."
      [navBase]="['/admin/user', targetUserId]"
    ></app-section-editor>
  `
})
export class AdminUserDetailPageComponent implements OnInit {
  targetUserId = '';
  targetName = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private data: DataService
  ) {}

  async ngOnInit(): Promise<void> {
    const admin = await this.auth.waitForReadyProfile();
    const userId = this.route.snapshot.paramMap.get('id');

    if (!admin?.id || admin.role !== 'admin' || !userId) {
      this.error = 'Invalid request.';
      return;
    }

    const tenantUser = await this.data.getTenantUser(admin.id, userId);
    if (tenantUser.error) {
      this.error = tenantUser.error;
      return;
    }
    if (!tenantUser.data) {
      this.error = 'User not in your tenant scope.';
      return;
    }

    this.targetUserId = userId;
    this.targetName = tenantUser.data.full_name;
  }
}
