# Visa Portal (Angular + Supabase)

Multi-tenant visa application frontend:
- `admin` logs in and sees all users where `users.admin_id = auth.uid()`
- `user` logs in and fills forms for all visa-related tables

## 1) Setup

1. Install dependencies:
   - `npm install`
2. Copy values from `.env.example` into `src/environments/environment.ts`.
3. Run app:
   - `npm start`

## 2) Database

1. Run your table creation SQL in Supabase.
2. Fix syntax in `test_certifications` table definition (remove trailing comma before closing `)`).
3. Run `supabase/rls-policies.sql` to enforce multi-tenant RLS access.

## 3) Auth + Roles

- Register as `Admin` to create a row in `public.admin`.
- Register as `User` with an existing Admin UUID to create a row in `public.users`.
- Role is resolved by checking `public.admin` and `public.users` tables by authenticated user ID.

## 4) App Routes

- `/login`
- `/register`
- `/app` user application forms
- `/admin` admin tenant user list
- `/admin/user/:id` admin view of user application data
