-- Visa Portal — Row Level Security Policies + Migrations
-- Run this ENTIRE script in Supabase SQL Editor after all tables are created.
-- Safe to re-run (uses DROP POLICY IF EXISTS and IF NOT EXISTS).

-- =============================================
-- MIGRATIONS
-- =============================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;

-- =============================================
-- CORE ROLE TABLES
-- =============================================

alter table public.admin enable row level security;
alter table public.users enable row level security;

-- Admin can view their own admin record
drop policy if exists "admin_view_own_record" on public.admin;
create policy "admin_view_own_record" on public.admin
  for select
  using (auth.uid() = id);

-- Admin can manage (CRUD) users assigned to them
drop policy if exists "admin_manage_assigned_users" on public.users;
create policy "admin_manage_assigned_users" on public.users
  for all
  using (admin_id = auth.uid())
  with check (admin_id = auth.uid());

-- Users can view their own record
drop policy if exists "user_view_own_record" on public.users;
create policy "user_view_own_record" on public.users
  for select
  using (id = auth.uid());

-- =============================================
-- DATA TABLES — Enable RLS
-- =============================================

alter table public.visa_applications enable row level security;
alter table public.student_details enable row level security;
alter table public.family_members enable row level security;
alter table public.relatives_australia enable row level security;
alter table public.travel_history enable row level security;
alter table public.resident_history enable row level security;
alter table public.identification_documents enable row level security;
alter table public.education_qualifications enable row level security;
alter table public.employment_history enable row level security;
alter table public.sponsor_details enable row level security;
alter table public.test_certifications enable row level security;
alter table public.australian_visa_history enable row level security;
alter table public.other_country_visa_history enable row level security;
alter table public.visa_refusal_history enable row level security;
alter table public.health_insurance enable row level security;
alter table public.coe_history enable row level security;
alter table public.skill_assessment enable row level security;

-- =============================================
-- USER SELF-ACCESS — users can CRUD their own rows
-- =============================================

drop policy if exists "users_own_visa_applications" on public.visa_applications;
create policy "users_own_visa_applications" on public.visa_applications for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_student_details" on public.student_details;
create policy "users_own_student_details" on public.student_details for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_family_members" on public.family_members;
create policy "users_own_family_members" on public.family_members for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_relatives_australia" on public.relatives_australia;
create policy "users_own_relatives_australia" on public.relatives_australia for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_travel_history" on public.travel_history;
create policy "users_own_travel_history" on public.travel_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_resident_history" on public.resident_history;
create policy "users_own_resident_history" on public.resident_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_identification_documents" on public.identification_documents;
create policy "users_own_identification_documents" on public.identification_documents for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_education_qualifications" on public.education_qualifications;
create policy "users_own_education_qualifications" on public.education_qualifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_employment_history" on public.employment_history;
create policy "users_own_employment_history" on public.employment_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_sponsor_details" on public.sponsor_details;
create policy "users_own_sponsor_details" on public.sponsor_details for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_test_certifications" on public.test_certifications;
create policy "users_own_test_certifications" on public.test_certifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_australian_visa_history" on public.australian_visa_history;
create policy "users_own_australian_visa_history" on public.australian_visa_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_other_country_visa_history" on public.other_country_visa_history;
create policy "users_own_other_country_visa_history" on public.other_country_visa_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_visa_refusal_history" on public.visa_refusal_history;
create policy "users_own_visa_refusal_history" on public.visa_refusal_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_health_insurance" on public.health_insurance;
create policy "users_own_health_insurance" on public.health_insurance for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_coe_history" on public.coe_history;
create policy "users_own_coe_history" on public.coe_history for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "users_own_skill_assessment" on public.skill_assessment;
create policy "users_own_skill_assessment" on public.skill_assessment for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- =============================================
-- ADMIN FULL ACCESS — admin can CRUD rows for their assigned users
-- Single "for all" policy per table covers SELECT + INSERT + UPDATE + DELETE.
-- The subquery checks: does the row's user_id belong to a user assigned to this admin?
-- =============================================

drop policy if exists "admin_read_visa_applications" on public.visa_applications;
drop policy if exists "admin_write_visa_applications" on public.visa_applications;
drop policy if exists "admin_manage_visa_applications" on public.visa_applications;
create policy "admin_manage_visa_applications" on public.visa_applications for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_student_details" on public.student_details;
drop policy if exists "admin_write_student_details" on public.student_details;
drop policy if exists "admin_manage_student_details" on public.student_details;
create policy "admin_manage_student_details" on public.student_details for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_family_members" on public.family_members;
drop policy if exists "admin_write_family_members" on public.family_members;
drop policy if exists "admin_manage_family_members" on public.family_members;
create policy "admin_manage_family_members" on public.family_members for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_relatives_australia" on public.relatives_australia;
drop policy if exists "admin_write_relatives_australia" on public.relatives_australia;
drop policy if exists "admin_manage_relatives_australia" on public.relatives_australia;
create policy "admin_manage_relatives_australia" on public.relatives_australia for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_travel_history" on public.travel_history;
drop policy if exists "admin_write_travel_history" on public.travel_history;
drop policy if exists "admin_manage_travel_history" on public.travel_history;
create policy "admin_manage_travel_history" on public.travel_history for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_resident_history" on public.resident_history;
drop policy if exists "admin_write_resident_history" on public.resident_history;
drop policy if exists "admin_manage_resident_history" on public.resident_history;
create policy "admin_manage_resident_history" on public.resident_history for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_identification_documents" on public.identification_documents;
drop policy if exists "admin_write_identification_documents" on public.identification_documents;
drop policy if exists "admin_manage_identification_documents" on public.identification_documents;
create policy "admin_manage_identification_documents" on public.identification_documents for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_education_qualifications" on public.education_qualifications;
drop policy if exists "admin_write_education_qualifications" on public.education_qualifications;
drop policy if exists "admin_manage_education_qualifications" on public.education_qualifications;
create policy "admin_manage_education_qualifications" on public.education_qualifications for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_employment_history" on public.employment_history;
drop policy if exists "admin_write_employment_history" on public.employment_history;
drop policy if exists "admin_manage_employment_history" on public.employment_history;
create policy "admin_manage_employment_history" on public.employment_history for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_sponsor_details" on public.sponsor_details;
drop policy if exists "admin_write_sponsor_details" on public.sponsor_details;
drop policy if exists "admin_manage_sponsor_details" on public.sponsor_details;
create policy "admin_manage_sponsor_details" on public.sponsor_details for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_test_certifications" on public.test_certifications;
drop policy if exists "admin_write_test_certifications" on public.test_certifications;
drop policy if exists "admin_manage_test_certifications" on public.test_certifications;
create policy "admin_manage_test_certifications" on public.test_certifications for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_australian_visa_history" on public.australian_visa_history;
drop policy if exists "admin_write_australian_visa_history" on public.australian_visa_history;
drop policy if exists "admin_manage_australian_visa_history" on public.australian_visa_history;
create policy "admin_manage_australian_visa_history" on public.australian_visa_history for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_other_country_visa_history" on public.other_country_visa_history;
drop policy if exists "admin_write_other_country_visa_history" on public.other_country_visa_history;
drop policy if exists "admin_manage_other_country_visa_history" on public.other_country_visa_history;
create policy "admin_manage_other_country_visa_history" on public.other_country_visa_history for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_visa_refusal_history" on public.visa_refusal_history;
drop policy if exists "admin_write_visa_refusal_history" on public.visa_refusal_history;
drop policy if exists "admin_manage_visa_refusal_history" on public.visa_refusal_history;
create policy "admin_manage_visa_refusal_history" on public.visa_refusal_history for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_health_insurance" on public.health_insurance;
drop policy if exists "admin_write_health_insurance" on public.health_insurance;
drop policy if exists "admin_manage_health_insurance" on public.health_insurance;
create policy "admin_manage_health_insurance" on public.health_insurance for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_coe_history" on public.coe_history;
drop policy if exists "admin_write_coe_history" on public.coe_history;
drop policy if exists "admin_manage_coe_history" on public.coe_history;
create policy "admin_manage_coe_history" on public.coe_history for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));

drop policy if exists "admin_read_skill_assessment" on public.skill_assessment;
drop policy if exists "admin_write_skill_assessment" on public.skill_assessment;
drop policy if exists "admin_manage_skill_assessment" on public.skill_assessment;
create policy "admin_manage_skill_assessment" on public.skill_assessment for all using (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid())) with check (exists (select 1 from public.users u where u.id = user_id and u.admin_id = auth.uid()));
