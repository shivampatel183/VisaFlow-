import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormControl, ReactiveFormsModule,
  UntypedFormArray, UntypedFormGroup, Validators, ValidatorFn
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../core/data.service';
import { APP_SECTIONS, FieldDef, SectionDef } from '../core/schema';

@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <ng-container *ngIf="activeSection; else loadingTpl">
      <!-- Page Header -->
      <div class="page-header">
        <h1>{{ title }}</h1>
        <p *ngIf="subtitle">{{ subtitle }}</p>
      </div>

      <!-- Toast Messages -->
      <div class="toast error" *ngIf="error">
        <span>⚠️</span>
        <span>{{ error }}</span>
      </div>
      <div class="toast success" *ngIf="success">
        <span>✅</span>
        <span>{{ success }}</span>
      </div>

      <!-- Section Card -->
      <section class="card" style="margin-bottom: 16px;">
        <div class="toolbar">
          <div>
            <h2>{{ activeSection.icon }} {{ activeSection.title }}</h2>
            <p class="notice" *ngIf="activeSection.repeatable">
              You can add multiple entries. Click "Add Entry" below.
            </p>
          </div>
          <div class="toolbar-actions">
            <button
              class="btn-secondary"
              *ngIf="activeSection.repeatable && canEdit"
              type="button"
              (click)="addRow(activeSection)"
            >
              ＋ Add Entry
            </button>
            <button
              class="btn-primary"
              type="button"
              (click)="saveActiveSection()"
              [disabled]="saving || !canEdit"
            >
              {{ saving ? 'Saving...' : '💾 Save Section' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Single Form (non-repeatable) -->
      <ng-container *ngIf="!activeSection.repeatable">
        <section class="card">
          <form [formGroup]="singleForm" class="grid two">
            <ng-container *ngFor="let field of activeSection.fields">
              <ng-container
                [ngTemplateOutlet]="inputTpl"
                [ngTemplateOutletContext]="{ field: field, group: singleForm }"
              ></ng-container>
            </ng-container>
          </form>
        </section>
      </ng-container>

      <!-- Repeatable Forms -->
      <ng-container *ngIf="activeSection.repeatable">
        <div [formGroup]="repeatFormHost">
          <div [formArrayName]="'rows'">
            <div
              class="section-item-card"
              *ngFor="let item of repeatArray.controls; index as i"
            >
              <div class="section-item-header">
                <span class="section-item-number">Entry #{{ i + 1 }}</span>
                <button
                  class="btn-danger btn-sm"
                  type="button"
                  *ngIf="canEdit"
                  (click)="removeRow(activeSection, i)"
                >
                  ✕ Remove
                </button>
              </div>
              <form [formGroup]="toFormGroup(item)" class="grid two">
                <ng-container *ngFor="let field of activeSection.fields">
                  <ng-container
                    [ngTemplateOutlet]="inputTpl"
                    [ngTemplateOutletContext]="{ field: field, group: toFormGroup(item) }"
                  ></ng-container>
                </ng-container>
              </form>
            </div>
          </div>
        </div>
        <div class="empty-state" *ngIf="!repeatArray.length">
          <div class="empty-state-icon">📭</div>
          <p>No entries yet. Click "Add Entry" to begin.</p>
        </div>
      </ng-container>
    </ng-container>

    <!-- Loading -->
    <ng-template #loadingTpl>
      <div class="empty-state">
        <div class="empty-state-icon">⏳</div>
        <p>Loading section...</p>
      </div>
    </ng-template>

    <!-- ====== FIELD TEMPLATE ====== -->
    <ng-template #inputTpl let-field="field" let-group="group">
      <!-- Text / Date / Email / Tel / Number -->
      <label *ngIf="field.type !== 'textarea' && field.type !== 'select' && field.type !== 'checkbox'">
        <span>
          {{ field.label }}
          <span class="required-star" *ngIf="field.required">*</span>
        </span>
        <input
          [type]="field.type"
          [formControl]="getControl(group, field.key)"
          [class.ng-invalid]="getControl(group, field.key).invalid && getControl(group, field.key).touched"
          [class.ng-touched]="getControl(group, field.key).touched"
        />
        <ng-container *ngIf="getControl(group, field.key).invalid && getControl(group, field.key).touched">
          <span class="field-error" *ngIf="getControl(group, field.key).errors?.['required']">
            This field is required
          </span>
          <span class="field-error" *ngIf="getControl(group, field.key).errors?.['email']">
            Enter a valid email address
          </span>
          <span class="field-error" *ngIf="getControl(group, field.key).errors?.['pattern']">
            {{ field.patternMsg || 'Invalid format' }}
          </span>
          <span class="field-error" *ngIf="getControl(group, field.key).errors?.['minlength']">
            Minimum {{ getControl(group, field.key).errors?.['minlength']?.requiredLength }} characters required
          </span>
        </ng-container>
      </label>

      <!-- Textarea -->
      <label *ngIf="field.type === 'textarea'">
        <span>
          {{ field.label }}
          <span class="required-star" *ngIf="field.required">*</span>
        </span>
        <textarea
          rows="3"
          [formControl]="getControl(group, field.key)"
          [class.ng-invalid]="getControl(group, field.key).invalid && getControl(group, field.key).touched"
          [class.ng-touched]="getControl(group, field.key).touched"
        ></textarea>
        <ng-container *ngIf="getControl(group, field.key).invalid && getControl(group, field.key).touched">
          <span class="field-error" *ngIf="getControl(group, field.key).errors?.['required']">
            This field is required
          </span>
        </ng-container>
      </label>

      <!-- Select -->
      <label *ngIf="field.type === 'select'">
        <span>
          {{ field.label }}
          <span class="required-star" *ngIf="field.required">*</span>
        </span>
        <select
          [formControl]="getControl(group, field.key)"
          [class.ng-invalid]="getControl(group, field.key).invalid && getControl(group, field.key).touched"
          [class.ng-touched]="getControl(group, field.key).touched"
        >
          <option value="">-- Select --</option>
          <option *ngFor="let option of field.options ?? []" [value]="option">{{ option }}</option>
        </select>
        <ng-container *ngIf="getControl(group, field.key).invalid && getControl(group, field.key).touched">
          <span class="field-error" *ngIf="getControl(group, field.key).errors?.['required']">
            This field is required
          </span>
        </ng-container>
      </label>

      <!-- Checkbox -->
      <label class="checkbox-wrap" *ngIf="field.type === 'checkbox'">
        <input type="checkbox" [formControl]="getControl(group, field.key)" />
        <span>{{ field.label }}</span>
      </label>
    </ng-template>
  `
})
export class SectionEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) userId = '';
  @Input() canEdit = true;
  @Input() title = 'Application Form';
  @Input() subtitle = '';
  @Input() sectionKey = '';

  readonly sections = APP_SECTIONS;
  readonly repeatArray: UntypedFormArray;
  readonly repeatFormHost: UntypedFormGroup;
  singleForm: UntypedFormGroup;

  activeSection: SectionDef | null = null;
  saving = false;
  error = '';
  success = '';

  private routeSub?: Subscription;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private data: DataService) {
    this.repeatArray = this.fb.array([]);
    this.repeatFormHost = this.fb.group({ rows: this.repeatArray });
    this.singleForm = this.fb.group({});
  }

  ngOnInit(): void {
    if (this.sectionKey) {
      void this.activateSection(this.sectionKey);
    } else {
      this.routeSub = this.route.paramMap.subscribe((params) => {
        const key = params.get('sectionKey') ?? this.sections[0].key;
        void this.activateSection(key);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sectionKey'] && this.sectionKey) {
      void this.activateSection(this.sectionKey);
    }
    if (changes['userId'] && this.userId && this.activeSection) {
      void this.loadActiveSection();
    }
    if (changes['canEdit'] && this.activeSection) {
      this.applyEditMode();
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  toFormGroup(control: AbstractControl): UntypedFormGroup {
    return control as UntypedFormGroup;
  }

  getControl(group: UntypedFormGroup, key: string): FormControl {
    return group.controls[key] as FormControl;
  }

  addRow(section: SectionDef): void {
    if (!section.repeatable || !this.canEdit) return;
    this.repeatArray.push(this.createRowGroup(section.fields));
    this.applyEditMode();
  }

  removeRow(section: SectionDef, index: number): void {
    if (!section.repeatable || !this.canEdit) return;
    this.repeatArray.removeAt(index);
  }

  async saveActiveSection(): Promise<void> {
    if (!this.activeSection || !this.userId || !this.canEdit || this.saving) return;

    // Mark all fields touched to trigger validation display
    if (!this.activeSection.repeatable) {
      this.markAllTouched(this.singleForm);
      if (this.singleForm.invalid) {
        this.error = 'Please fix the highlighted errors before saving.';
        return;
      }
    } else {
      let hasInvalid = false;
      for (const ctrl of this.repeatArray.controls) {
        this.markAllTouched(ctrl as UntypedFormGroup);
        if (ctrl.invalid) hasInvalid = true;
      }
      if (hasInvalid) {
        this.error = 'Please fix the highlighted errors before saving.';
        return;
      }
    }

    this.saving = true;
    this.error = '';
    this.success = '';

    const result = this.activeSection.repeatable
      ? await this.data.replaceMany(this.activeSection.table, this.userId, this.repeatArray.getRawValue())
      : await this.data.upsertSingle(this.activeSection.table, this.userId, this.singleForm.getRawValue());

    this.saving = false;
    if (result.error) {
      this.error = result.error;
      return;
    }

    this.success = `${this.activeSection.title} saved successfully.`;
    setTimeout(() => { this.success = ''; }, 4000);
  }

  private async activateSection(sectionKey: string): Promise<void> {
    const section = this.sections.find((s) => s.key === sectionKey) ?? this.sections[0];
    this.activeSection = section;
    this.error = '';
    this.success = '';

    if (section.repeatable) {
      this.repeatArray.clear();
      this.singleForm = this.fb.group({});
    } else {
      this.singleForm = this.createRowGroup(section.fields);
      this.repeatArray.clear();
    }

    if (this.userId) {
      await this.loadActiveSection();
    } else {
      this.applyEditMode();
    }
  }

  private async loadActiveSection(): Promise<void> {
    if (!this.activeSection || !this.userId) return;

    const section = this.activeSection;
    let tableData: unknown;
    try {
      const result = await this.data.loadUserData(this.userId, [section]);
      tableData = result[section.table];
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Unable to load this section.';
      return;
    }

    if (!section.repeatable) {
      this.singleForm = this.createRowGroup(section.fields);
      const row = (tableData as Record<string, unknown> | null) ?? null;
      if (row) this.singleForm.patchValue(row);
      this.applyEditMode();
      return;
    }

    this.repeatArray.clear();
    const rows = (tableData as Array<Record<string, unknown>>) ?? [];

    if (!rows.length && this.canEdit) {
      this.repeatArray.push(this.createRowGroup(section.fields));
      this.applyEditMode();
      return;
    }

    for (const row of rows) {
      const form = this.createRowGroup(section.fields);
      form.patchValue(row);
      this.repeatArray.push(form);
    }
    this.applyEditMode();
  }

  private createRowGroup(fields: FieldDef[]): UntypedFormGroup {
    const controls: Record<string, unknown> = {};
    for (const field of fields) {
      const validators: ValidatorFn[] = [];
      if (field.required) validators.push(Validators.required);
      if (field.type === 'email') validators.push(Validators.email);
      if (field.pattern) validators.push(Validators.pattern(field.pattern));
      if (field.minLength) validators.push(Validators.minLength(field.minLength));
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));

      const defaultVal = field.type === 'checkbox' ? false : '';
      controls[field.key] = this.fb.control(defaultVal, validators);
    }
    return this.fb.group(controls);
  }

  private applyEditMode(): void {
    if (this.canEdit) {
      this.singleForm.enable({ emitEvent: false });
      for (const row of this.repeatArray.controls) {
        row.enable({ emitEvent: false });
      }
      return;
    }
    this.singleForm.disable({ emitEvent: false });
    for (const row of this.repeatArray.controls) {
      row.disable({ emitEvent: false });
    }
  }

  private markAllTouched(group: UntypedFormGroup): void {
    Object.values(group.controls).forEach(ctrl => {
      ctrl.markAsTouched();
      ctrl.updateValueAndValidity();
    });
  }
}
