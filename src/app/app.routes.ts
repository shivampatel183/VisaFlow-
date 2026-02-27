import { Routes } from '@angular/router';
import { adminGuard, authGuard, userGuard } from './core/guards';
import { LoginPageComponent } from './auth/login-page.component';
import { LayoutComponent } from './layout/layout.component';
import { SectionPageComponent } from './application/section-page.component';
import { AdminUsersPageComponent } from './admin/admin-users-page.component';
import { AdminSectionPageComponent } from './admin/admin-section-page.component';

export const routes: Routes = [
  // Auth
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },

  // User Application — tabbed interface inside layout
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [userGuard],
    children: [
      { path: '', component: SectionPageComponent }
    ]
  },

  // Admin — user list
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminUsersPageComponent }
    ]
  },

  // Admin — edit specific user's application (tabbed)
  {
    path: 'admin/user/:id',
    component: LayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminSectionPageComponent }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];
