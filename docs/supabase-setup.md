# Supabase Setup

This project uses Supabase for:

- Auth for `/admin`
- PostgreSQL tables for projects, translations, editable site content, settings and contact messages
- Supabase Storage buckets for project media and CV files
- Edge Function `send-contact-email` for contact form email delivery

## 1. Create a Supabase Project

Create a project in Supabase and copy:

- Project URL
- Anon public key

Add them to `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CONTACT_FUNCTION_NAME=send-contact-email
```

Use `.env.example` as the template.

## 2. Apply Database Schema

Option A: SQL Editor

1. Open Supabase Dashboard.
2. Go to SQL Editor.
3. Run `supabase/schema.sql`.

Option B: Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

The migration files are:

```text
supabase/migrations/20260608120000_portfolio_schema.sql
supabase/migrations/20260608133000_site_content.sql
```

The schema also creates `public.site_content`. This table stores editable
homepage/portfolio texts for PL and EN plus the company logo strip content.

## 3. Create Admin User

1. In Supabase Dashboard, go to Authentication.
2. Create a user with email and password.
3. Copy the user UUID.
4. Run this in SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('AUTH_USER_UUID');
```

After that, `/admin` can log in with that email and password.

## 4. Storage Buckets

The schema creates public buckets automatically:

- `project-media`
- `cv`

If you run into Storage policy errors, verify that these buckets exist and are public.

## 5. Contact Form Email

The contact form calls the Supabase Edge Function:

```text
send-contact-email
```

Set secrets:

```bash
npx supabase secrets set RESEND_API_KEY=your-resend-api-key
npx supabase secrets set CONTACT_TO_EMAIL=your.email@example.com
npx supabase secrets set "CONTACT_FROM_EMAIL=Portfolio <noreply@your-domain.com>"
npx supabase secrets set CONTACT_ALLOWED_ORIGIN=https://your-domain.com
```

For local development use:

```bash
npx supabase secrets set CONTACT_ALLOWED_ORIGIN=http://localhost:5173
```

Deploy the function:

```bash
npx supabase functions deploy send-contact-email
```

## 6. Run The App

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Admin:

```text
http://localhost:5173/admin
```

## 7. Production Checklist

- Set production `VITE_SITE_URL`.
- Set production `VITE_SUPABASE_URL`.
- Set production `VITE_SUPABASE_ANON_KEY`.
- Deploy `send-contact-email`.
- Set `CONTACT_ALLOWED_ORIGIN` to the production domain.
- Add the admin user UUID to `public.admin_users`.
- Fill the "Treści strony" section in `/admin`.
- Upload CV in `/admin`.
- Add real project media through `/admin`.
