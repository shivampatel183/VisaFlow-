import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

const resolveReadyProfile = async () => {
  const auth = inject(AuthService);
  return auth.waitForReadyProfile();
};

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const profile = await resolveReadyProfile();
  if (!profile) {
    return router.parseUrl('/login');
  }
  return true;
};

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const profile = await resolveReadyProfile();
  if (!profile) {
    return router.parseUrl('/login');
  }
  return profile.role === 'admin' ? true : router.parseUrl('/app');
};

export const userGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const profile = await resolveReadyProfile();
  if (!profile) {
    return router.parseUrl('/login');
  }
  return profile.role === 'user' ? true : router.parseUrl('/admin');
};
