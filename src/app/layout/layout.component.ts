import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, AppProfile } from '../core/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <!-- Header Bar -->
    <nav class="crm-navbar">
      <div class="crm-navbar-left">
        <a class="crm-brand-link" [routerLink]="homeLink">
          <span class="crm-brand-logo">Visa<span class="flow">Flow</span></span>
        </a>
      </div>

      <div class="crm-navbar-right">
        <!-- Important Links Dropdown -->
        <div class="crm-dropdown" (click)="toggleLinks()" (mouseenter)="showLinks = true" (mouseleave)="showLinks = false">
          <button class="crm-dropdown-toggle">Important Links ▾</button>
          <div class="crm-dropdown-menu" *ngIf="showLinks">
            <a href="https://www.act.gov.au/migration/skilled-migrants/canberra-matrix/check-your-canberra-matrix-score-overseas-applicants" target="_blank">Overseas Canberra Matrix</a>
            <a href="https://www.act.gov.au/migration/skilled-migrants/canberra-matrix/check-your-canberra-matrix-score-canberra-residents" target="_blank">Residents Canberra Matrix</a>
            <a href="https://online.immi.gov.au/evo/firstParty?actionType=query" target="_blank">VEVO Check</a>
            <a href="https://www.afp.gov.au/what-we-do/services/criminal-records/national-police-checks" target="_blank">AFP</a>
            <a href="https://www.bupa.com.au/bupamvs" target="_blank">BUPA Medical Visa Services</a>
            <a href="https://services.vfsglobal.com/aus/en/ind" target="_blank">Indian VFS</a>
            <a href="https://immi.homeaffairs.gov.au/help-support/departmental-forms/pdf-forms" target="_blank">Aus Immi Form</a>
            <a href="https://cricos.education.gov.au/default.aspx" target="_blank">CRICOS</a>
          </div>
        </div>

        <!-- User Dropdown -->
        <div class="crm-dropdown" (click)="toggleUser()" (mouseenter)="showUser = true" (mouseleave)="showUser = false">
          <button class="crm-dropdown-toggle">
            Welcome, {{ profile?.fullName || 'User' }} ▾
          </button>
          <div class="crm-dropdown-menu" *ngIf="showUser">
            <span class="crm-dropdown-info">Role: {{ profile?.role }}</span>
            <a (click)="logout()" class="crm-dropdown-item-danger">🚪 Logout</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="crm-content-wrapper">
      <router-outlet></router-outlet>
    </div>
  `
})
export class LayoutComponent implements OnInit, OnDestroy {
  profile: AppProfile | null = null;
  homeLink = '/app';
  showLinks = false;
  showUser = false;
  private sub?: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.auth.profile$.subscribe(p => {
      this.profile = p;
      this.homeLink = p?.role === 'admin' ? '/admin' : '/app';
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleLinks(): void {
    this.showLinks = !this.showLinks;
  }

  toggleUser(): void {
    this.showUser = !this.showUser;
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login');
  }
}
