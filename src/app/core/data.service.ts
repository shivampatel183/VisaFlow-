import { Injectable } from "@angular/core";
import { SectionDef } from "./schema";
import { SupabaseService } from "./supabase.service";

@Injectable({ providedIn: "root" })
export class DataService {
  constructor(private supabase: SupabaseService) {}

  async loadUserData(
    userId: string,
    sections: SectionDef[],
  ): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {};
    await Promise.all(
      sections.map(async (section) => {
        const query = this.supabase.client
          .from(section.table)
          .select("*")
          .eq("user_id", userId);
        if (section.repeatable) {
          const { data, error } = await query.order("updated_at", {
            ascending: true,
          });
          if (error) {
            throw new Error(error.message);
          }
          result[section.table] = data ?? [];
        } else {
          const { data, error } = await query.maybeSingle();
          if (error) {
            throw new Error(error.message);
          }
          result[section.table] = data ?? null;
        }
      }),
    );
    return result;
  }

  async upsertSingle(
    table: string,
    userId: string,
    payload: Record<string, unknown>,
  ): Promise<{ error?: string }> {
    const row = {
      ...payload,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };
    const { error } = await this.supabase.client
      .from(table)
      .upsert(row, { onConflict: "user_id" });
    return error ? { error: error.message } : {};
  }

  async replaceMany(
    table: string,
    userId: string,
    rows: Record<string, unknown>[],
  ): Promise<{ error?: string }> {
    const del = await this.supabase.client
      .from(table)
      .delete()
      .eq("user_id", userId);
    if (del.error) {
      return { error: del.error.message };
    }
    if (!rows.length) {
      return {};
    }
    const payload = rows.map((row) => ({
      ...row,
      user_id: userId,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await this.supabase.client.from(table).insert(payload);
    return error ? { error: error.message } : {};
  }

  async getTenantUsers(
    adminId: string,
  ): Promise<{
    data: Array<{ id: string; full_name: string; email?: string }>;
    error?: string;
  }> {
    const { data, error } = await this.supabase.client
      .from("users")
      .select("id, full_name, email")
      .eq("admin_id", adminId)
      .order("full_name", { ascending: true });
    return { data: data ?? [], error: error?.message };
  }

  async getTenantUser(
    adminId: string,
    userId: string,
  ): Promise<{
    data: { id: string; full_name: string } | null;
    error?: string;
  }> {
    const { data, error } = await this.supabase.client
      .from("users")
      .select("id, full_name")
      .eq("admin_id", adminId)
      .eq("id", userId)
      .maybeSingle();
    return { data: data ?? null, error: error?.message };
  }

  /** Delete a user record (admin action). */
  async deleteUser(adminId: string, userId: string): Promise<{ error?: string }> {
    // Verify user belongs to this admin first
    const check = await this.supabase.client
      .from("users")
      .select("id")
      .eq("admin_id", adminId)
      .eq("id", userId)
      .maybeSingle();
    if (check.error) return { error: check.error.message };
    if (!check.data) return { error: "User not found or not in your scope." };

    // Delete user's data from all related tables
    const tables = [
      'visa_applications', 'student_details', 'family_members', 'relatives_australia',
      'travel_history', 'resident_history', 'identification_documents', 'education_qualifications',
      'employment_history', 'sponsor_details', 'test_certifications', 'australian_visa_history',
      'other_country_visa_history', 'visa_refusal_history', 'health_insurance', 'coe_history', 'skill_assessment'
    ];

    for (const table of tables) {
      const { error } = await this.supabase.client.from(table).delete().eq("user_id", userId);
      if (error) return { error: `Failed to delete from ${table}: ${error.message}` };
    }

    // Delete the user record itself
    const { error } = await this.supabase.client.from("users").delete().eq("id", userId);
    return error ? { error: error.message } : {};
  }
}
