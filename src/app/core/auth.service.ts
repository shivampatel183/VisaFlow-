import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

export type AppRole = 'admin' | 'user' | null;

export interface AppProfile {
  id: string;
  role: AppRole;
  fullName: string | null;
  adminId?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly profile$ = new BehaviorSubject<AppProfile | null>(null);
  readonly loading$ = new BehaviorSubject<boolean>(true);

  constructor(private supabase: SupabaseService) {
    this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    // Keep callback synchronous; async callbacks can deadlock Supabase auth locks.
    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      void this.resolveProfile(session?.user?.id ?? null);
    });

    try {
      const { data } = await this.supabase.client.auth.getSession();
      await this.resolveProfile(data.session?.user?.id ?? null);
    } catch {
      // Ensure app doesn't stay stuck in loading if lock/session retrieval fails.
      await this.resolveProfile(null);
    }
  }

  async waitForReadyProfile(): Promise<AppProfile | null> {
    await firstValueFrom(this.loading$.pipe(filter((loading) => !loading)));
    if (this.profile$.value) {
      return this.profile$.value;
    }

    const { data } = await this.supabase.client.auth.getUser();
    if (data.user?.id) {
      await this.resolveProfile(data.user.id);
    }

    return this.profile$.value;
  }

  private async resolveProfile(userId: string | null): Promise<void> {
    if (!userId) {
      this.profile$.next(null);
      this.loading$.next(false);
      return;
    }

    const [{ data: adminRow }, { data: userRow }] = await Promise.all([
      this.supabase.client.from('admin').select('id, full_name').eq('id', userId).maybeSingle(),
      this.supabase.client.from('users').select('id, full_name, admin_id').eq('id', userId).maybeSingle()
    ]);

    if (adminRow) {
      this.profile$.next({ id: adminRow.id, role: 'admin', fullName: adminRow.full_name });
      this.loading$.next(false);
      return;
    }

    if (userRow) {
      this.profile$.next({
        id: userRow.id,
        role: 'user',
        fullName: userRow.full_name,
        adminId: userRow.admin_id
      });
      this.loading$.next(false);
      return;
    }

    this.profile$.next(null);
    this.loading$.next(false);
  }

  async signIn(email: string, password: string): Promise<{ error?: string }> {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (!error) {
      await this.resolveProfile(data.user?.id ?? null);
    }
    return error ? { error: error.message } : {};
  }

  async signUpAdmin(email: string, password: string, fullName: string): Promise<{ error?: string }> {
    const { data, error } = await this.supabase.client.auth.signUp({ email, password });
    if (error || !data.user) {
      return { error: error?.message ?? 'Unable to create admin account' };
    }
    const insert = await this.supabase.client.from('admin').insert({ id: data.user.id, full_name: fullName });
    return insert.error ? { error: insert.error.message } : {};
  }

  async signUpUser(email: string, password: string, fullName: string, adminId: string): Promise<{ error?: string }> {
    const { data, error } = await this.supabase.client.auth.signUp({ email, password });
    if (error || !data.user) {
      return { error: error?.message ?? 'Unable to create user account' };
    }
    const insert = await this.supabase.client
      .from('users')
      .insert({ id: data.user.id, full_name: fullName, admin_id: adminId });
    return insert.error ? { error: insert.error.message } : {};
  }

  async adminCreateUser(email: string, password: string, adminId: string, fullName?: string): Promise<{ error?: string }> {
    const isolatedAuthClient = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    const { data, error } = await isolatedAuthClient.auth.signUp({ email, password });
    if (error || !data.user) {
      return { error: error?.message ?? 'Unable to create user auth account' };
    }

    const derivedName = fullName?.trim() || email.split('@')[0] || 'New User';
    const insert = await this.supabase.client.from('users').insert({
      id: data.user.id,
      full_name: derivedName,
      email: email,
      admin_id: adminId
    });

    return insert.error ? { error: insert.error.message } : {};
  }

  async signOut(): Promise<void> {
    await this.supabase.client.auth.signOut();
    this.profile$.next(null);
  }
}
