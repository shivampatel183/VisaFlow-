import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { SectionEditorComponent } from './section-editor.component';

@Component({
  standalone: true,
  imports: [CommonModule, SectionEditorComponent],
  template: `
    <section class="card" *ngIf="error">
      <p class="error">{{ error }}</p>
    </section>

    <app-section-editor
      *ngIf="userId && !error"
      [userId]="userId"
      [canEdit]="true"
      [title]="'My Visa Application'"
      [subtitle]="'Each page maps to one table. Open a section, update values, and save.'"
      [navBase]="['/app']"
    ></app-section-editor>
  `
})
export class UserApplicationPageComponent implements OnInit {
  userId = '';
  error = '';

  constructor(private auth: AuthService) {}

  async ngOnInit(): Promise<void> {
    const profile = this.auth.profile$.value;
    if (!profile?.id) {
      this.error = 'Session not found. Please login again.';
      return;
    }
    this.userId = profile.id;
  }
}
