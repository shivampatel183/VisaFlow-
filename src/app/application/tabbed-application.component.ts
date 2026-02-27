import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_TABS, APP_SECTIONS, TabDef, SectionDef, FieldDef, FieldGroup } from '../core/schema';
import { DataService } from '../core/data.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-tabbed-application',
  template: `
    <!-- Page Header -->
    <section class="crm-content-header">
      <div class="crm-header-row">
        <h1 *ngIf="pageTitle">{{ pageTitle }}</h1>
        <div style="display:flex; gap:8px; align-items:center;">
          <button *ngIf="isAdminContext" class="crm-btn crm-btn-primary crm-btn-sm no-print" (click)="printAll()" type="button">
            🖨️ Print Application
          </button>
          <a *ngIf="isAdminContext" routerLink="/admin" class="crm-btn crm-btn-secondary crm-btn-sm no-print">
            <span>←</span> Back to Application List
          </a>
        </div>
      </div>
    </section>

    <!-- Marquee Warning -->
    <div class="crm-marquee" *ngIf="canEdit">
      <marquee>You are solely responsible for ensuring that we have your updated details. It's your responsibility to update here if any changes in details</marquee>
    </div>

    <!-- Loading State -->
    <div class="crm-loading" *ngIf="loading">
      <div class="spinner"></div>
      <p>Loading application data...</p>
    </div>

    <!-- Error State -->
    <div class="toast error" *ngIf="globalError">
      <span>⚠️</span>
      <span>{{ globalError }}</span>
    </div>

    <!-- Main Card with Tabs -->
    <div class="crm-card" *ngIf="!loading && !globalError">
      <!-- Tab Navigation -->
      <div class="crm-card-header">
        <ul class="crm-nav-tabs">
          <li *ngFor="let tab of tabs; let i = index"
              class="crm-nav-item"
              [class.active]="activeTabIndex === i"
              (click)="switchTab(i)">
            <a class="crm-nav-link" [class.active]="activeTabIndex === i">{{ tab.title }}</a>
          </li>
        </ul>
      </div>

      <!-- Tab Content -->
      <div class="crm-card-body">
        <div *ngFor="let tab of tabs; let ti = index" [style.display]="printing || activeTabIndex === ti ? 'block' : 'none'">
          <h2 class="print-tab-title" *ngIf="printing">{{ tab.title }}</h2>
          <!-- Each section in the tab as a card -->
          <ng-container *ngFor="let section of tab.sections">

            <!-- NON-REPEATABLE SECTION with field groups -->
            <ng-container *ngIf="!section.repeatable && section.fieldGroups?.length">
              <div *ngFor="let group of section.fieldGroups" class="crm-section-card">
                <div class="crm-section-header">
                  <h3>{{ group.title }}</h3>
                </div>
                <div class="crm-section-body">
                  <div class="crm-form-grid">
                    <ng-container *ngFor="let field of group.fields">
                      <div class="crm-form-group">
                        <label class="crm-label">
                          {{ field.label }}
                          <span class="text-danger" *ngIf="field.required">*</span>
                        </label>
                        <ng-container [ngSwitch]="field.type">
                          <select *ngSwitchCase="'select'" class="crm-input"
                                  [disabled]="!canEdit"
                                  [(ngModel)]="singleData[section.table][field.key]">
                            <option value="">Select {{ field.label }}</option>
                            <option *ngFor="let opt of field.options" [value]="opt">{{ opt }}</option>
                          </select>
                          <input *ngSwitchDefault class="crm-input"
                                 [type]="field.type"
                                 [disabled]="!canEdit"
                                 [(ngModel)]="singleData[section.table][field.key]"
                                 [placeholder]="field.label" />
                        </ng-container>
                      </div>
                    </ng-container>
                  </div>
                </div>
              </div>
            </ng-container>

            <!-- NON-REPEATABLE SECTION without field groups -->
            <ng-container *ngIf="!section.repeatable && !section.fieldGroups?.length">
              <div class="crm-section-card">
                <div class="crm-section-header">
                  <h3>{{ section.title }}</h3>
                </div>
                <div class="crm-section-body">
                  <div class="crm-form-grid">
                    <ng-container *ngFor="let field of section.fields">
                      <div class="crm-form-group">
                        <label class="crm-label">
                          {{ field.label }}
                          <span class="text-danger" *ngIf="field.required">*</span>
                        </label>
                        <ng-container [ngSwitch]="field.type">
                          <select *ngSwitchCase="'select'" class="crm-input"
                                  [disabled]="!canEdit"
                                  [(ngModel)]="singleData[section.table][field.key]">
                            <option value="">Select {{ field.label }}</option>
                            <option *ngFor="let opt of field.options" [value]="opt">{{ opt }}</option>
                          </select>
                          <input *ngSwitchDefault class="crm-input"
                                 [type]="field.type"
                                 [disabled]="!canEdit"
                                 [(ngModel)]="singleData[section.table][field.key]"
                                 [placeholder]="field.label" />
                        </ng-container>
                      </div>
                    </ng-container>
                  </div>
                </div>
              </div>
            </ng-container>

            <!-- REPEATABLE SECTION -->
            <ng-container *ngIf="section.repeatable">
              <div class="crm-section-card">
                <div class="crm-section-header">
                  <h3>{{ section.title }}</h3>
                </div>
                <div class="crm-section-body">
                  <div *ngIf="!repeatableData[section.table]?.length && !canEdit" class="crm-empty">
                    No records added yet.
                  </div>

                  <div *ngFor="let row of repeatableData[section.table]; let ri = index"
                       class="crm-repeatable-row" [class.crm-alt-bg]="ri % 2 === 0">
                    <div class="crm-form-grid">
                      <ng-container *ngFor="let field of section.fields">
                        <div class="crm-form-group">
                          <label class="crm-label">
                            {{ field.label }}
                            <span class="text-danger" *ngIf="field.required">*</span>
                          </label>
                          <ng-container [ngSwitch]="field.type">
                            <select *ngSwitchCase="'select'" class="crm-input"
                                    [disabled]="!canEdit"
                                    [(ngModel)]="row[field.key]">
                              <option value="">Select {{ field.label }}</option>
                              <option *ngFor="let opt of field.options" [value]="opt">{{ opt }}</option>
                            </select>
                            <input *ngSwitchDefault class="crm-input"
                                   [type]="field.type"
                                   [disabled]="!canEdit"
                                   [(ngModel)]="row[field.key]"
                                   [placeholder]="field.label" />
                          </ng-container>
                        </div>
                      </ng-container>

                      <!-- Add/Remove button -->
                      <div class="crm-form-group crm-action-col" *ngIf="canEdit">
                        <label class="crm-label">&nbsp;</label>
                        <button *ngIf="ri === 0" class="crm-btn crm-btn-primary crm-btn-sm" type="button"
                                (click)="addRow(section)">
                          <span>＋</span> Add
                        </button>
                        <button *ngIf="ri > 0" class="crm-btn crm-btn-danger crm-btn-sm" type="button"
                                (click)="removeRow(section, ri)">
                          <span>🗑</span> Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Add first row if none -->
                  <div *ngIf="!repeatableData[section.table]?.length && canEdit" style="padding: 8px 0;">
                    <button class="crm-btn crm-btn-primary crm-btn-sm" type="button"
                            (click)="addRow(section)">
                      <span>＋</span> Add {{ section.title }}
                    </button>
                  </div>
                </div>
              </div>
            </ng-container>
          </ng-container>
        </div>
      </div>

      <!-- Footer with Save -->
      <div class="crm-card-footer" *ngIf="canEdit">
        <button class="crm-btn crm-btn-primary" (click)="saveAll()" [disabled]="saving">
          <span *ngIf="saving" class="spinner" style="width:16px;height:16px;border-width:2px;"></span>
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <a *ngIf="isAdminContext" routerLink="/admin" class="crm-btn crm-btn-default">Cancel</a>
      </div>
    </div>

    <!-- Success / Error Toast -->
    <div class="toast success" *ngIf="saveSuccess" style="margin-top:12px;">
      <span>✅</span>
      <span>{{ saveSuccess }}</span>
    </div>
    <div class="toast error" *ngIf="saveError" style="margin-top:12px;">
      <span>⚠️</span>
      <span>{{ saveError }}</span>
    </div>
  `
})
export class TabbedApplicationComponent implements OnInit {
  @Input() userId = '';
  @Input() canEdit = true;
  @Input() pageTitle = '';
  @Input() isAdminContext = false;
  @Input() autoPrint = false;

  tabs = APP_TABS;
  activeTabIndex = 0;
  loading = true;
  saving = false;
  globalError = '';
  saveSuccess = '';
  saveError = '';

  /** Single-record tables: { table_name: { field: value } } */
  singleData: Record<string, Record<string, any>> = {};

  /** Repeatable tables: { table_name: [ { field: value }, ... ] } */
  repeatableData: Record<string, Record<string, any>[]> = {};

  constructor(private data: DataService) {}

  async ngOnInit(): Promise<void> {
    if (!this.userId) {
      this.globalError = 'No user ID provided.';
      this.loading = false;
      return;
    }
    await this.loadAllData();
    if (this.autoPrint) {
      this.printAll();
    }
  }

  printing = false;

  switchTab(index: number): void {
    this.activeTabIndex = index;
    this.saveSuccess = '';
    this.saveError = '';
  }

  printAll(): void {
    this.printing = true;
    setTimeout(() => {
      window.print();
      this.printing = false;
    }, 300);
  }

  addRow(section: SectionDef): void {
    if (!this.repeatableData[section.table]) {
      this.repeatableData[section.table] = [];
    }
    const emptyRow: Record<string, any> = {};
    section.fields.forEach(f => emptyRow[f.key] = '');
    this.repeatableData[section.table].push(emptyRow);
  }

  removeRow(section: SectionDef, index: number): void {
    this.repeatableData[section.table]?.splice(index, 1);
  }

  async saveAll(): Promise<void> {
    if (this.saving) return;
    this.saving = true;
    this.saveError = '';
    this.saveSuccess = '';

    try {
      // Save all sections across all tabs
      for (const section of APP_SECTIONS) {
        if (section.repeatable) {
          const rows = (this.repeatableData[section.table] || []).map(row => this.sanitizeData(section, row));
          const res = await this.data.replaceMany(section.table, this.userId, rows);
          if (res.error) {
            this.saveError = `Error saving ${section.title}: ${res.error}`;
            this.saving = false;
            return;
          }
        } else {
          const rawRow = this.singleData[section.table];
          if (rawRow) {
            const row = this.sanitizeData(section, rawRow);
            const res = await this.data.upsertSingle(section.table, this.userId, row);
            if (res.error) {
              this.saveError = `Error saving ${section.title}: ${res.error}`;
              this.saving = false;
              return;
            }
          }
        }
      }

      this.saveSuccess = 'All changes saved successfully.';
      this.saving = false;
      setTimeout(() => { this.saveSuccess = ''; }, 4000);
    } catch (e: any) {
      this.saveError = e.message || 'Unknown error while saving.';
      this.saving = false;
    }
  }

  /** Convert empty strings to null for date fields to avoid DB errors */
  private sanitizeData(section: SectionDef, data: Record<string, any>): Record<string, any> {
    const sanitized = { ...data };
    section.fields.forEach(field => {
      if (field.type === 'date' && sanitized[field.key] === '') {
        sanitized[field.key] = null;
      }
    });
    return sanitized;
  }

  private async loadAllData(): Promise<void> {
    this.loading = true;
    this.globalError = '';

    try {
      const allData = await this.data.loadUserData(this.userId, APP_SECTIONS);

      // Distribute data
      for (const section of APP_SECTIONS) {
        if (section.repeatable) {
          this.repeatableData[section.table] = (allData[section.table] as any[]) || [];
        } else {
          const raw = allData[section.table] as Record<string, any> | null;
          if (raw) {
            this.singleData[section.table] = { ...raw };
          } else {
            // Initialize empty object so ngModel binds work
            const empty: Record<string, any> = {};
            section.fields.forEach(f => empty[f.key] = '');
            this.singleData[section.table] = empty;
          }
        }
      }

      this.loading = false;
    } catch (e: any) {
      this.globalError = e.message || 'Failed to load application data.';
      this.loading = false;
    }
  }
}
