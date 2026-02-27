import { Injectable } from "@angular/core";
import { createClient, processLock } from "@supabase/supabase-js";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private readonly supabaseKey = environment.supabaseAnonKey;

  constructor() {
    if (this.supabaseKey.startsWith("sb_secret_")) {
      throw new Error(
        "Invalid Supabase key for browser: secret key detected. Use anon/publishable key.",
      );
    }
  }

  readonly client = createClient(environment.supabaseUrl, this.supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Avoid browser Navigator Lock contention causing auth-token timeout errors.
      lock: processLock,
    },
  });
}
