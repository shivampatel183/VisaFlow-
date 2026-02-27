import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../core/auth.service";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-box">
        <!-- Logo / Brand -->
        <div class="login-logo">
          <h1 class="crm-brand-logo">Visa<span class="flow">Flow</span></h1>
          <p>Sign in to manage your visa application</p>
        </div>

        <!-- Login Card -->
        <div class="login-card-body">
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="login-field">
              <label>Email <span class="text-danger">*</span></label>
              <div class="login-input-wrap">
                <span class="login-input-icon">📧</span>
                <input type="email" formControlName="email" placeholder="you&#64;example.com" autocomplete="email" />
              </div>
            </div>

            <div class="login-field">
              <label>Password <span class="text-danger">*</span></label>
              <div class="login-input-wrap">
                <span class="login-input-icon">🔒</span>
                <input type="password" formControlName="password" placeholder="Enter your password" autocomplete="current-password" />
              </div>
            </div>

            <button class="crm-btn crm-btn-primary login-submit" type="submit" [disabled]="loading || form.invalid">
              <span *ngIf="loading" class="spinner" style="width:16px;height:16px;border-width:2px;"></span>
              {{ loading ? "Signing in..." : "Sign In" }}
            </button>
          </form>

          <div class="toast error" *ngIf="error" style="margin-top: 16px;">
            <span>⚠️</span>
            <span>{{ error }}</span>
          </div>

          <p class="login-footer-text">Managed by your organization administrator</p>
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  loading = false;
  error = "";
  readonly form: UntypedFormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.nonNullable.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid || this.loading) {
      return;
    }
    this.loading = true;
    this.error = "";
    const { error } = await this.auth.signIn(
      this.form.getRawValue().email,
      this.form.getRawValue().password,
    );
    if (error) {
      this.error = error;
      this.loading = false;
      return;
    }

    const role = this.auth.profile$.value?.role;
    this.loading = false;
    await this.router.navigateByUrl(role === "admin" ? "/admin" : "/app");
  }
}
