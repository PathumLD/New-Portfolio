<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1jGdbcIVv2XD9B0iysbMmJp1qAOEaGk7u

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set the Supabase variables in your local/deployment environment:
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
4. Run the app:
   `npm run dev`

The contact form saves submissions directly to Supabase. Optional attachments upload into the private `contact-attachments` bucket under a unique `contact-submissions/{submission-id}` folder, and the admin Messages page generates short-lived download links.

## Supabase setup

Apply the migrations in `supabase/migrations` to your Supabase project. The booking migration creates the `bookings` table and RLS policies so public visitors can only create pending booking requests, while the admin email can manage them. The contact messages migration creates `contact_messages`, a private `contact-attachments` bucket, upload policies for public visitors, and admin-only read/download access. The experiences migration creates the `experiences` table, seeds the current code-based experience timeline, and lets the admin manage it from `/admin/experiences`.

## Prisma ORM

Prisma is used for server/local database updates against Supabase Postgres. Set `DATABASE_URL` and `DIRECT_URL` in `.env`, then generate the Prisma client:

```bash
npm run prisma:generate
```

Create or sync the Prisma-managed tables:

```bash
npm run db:push
```

To upsert the current experience timeline through Prisma ORM:

```bash
npm run db:seed:experiences
```

Keep Prisma scripts server-side only. The public portfolio and admin UI still use the Supabase browser client for reads and authenticated CRUD. If the browser shows a Supabase REST `404` for `/rest/v1/experiences`, the `experiences` table has not been created/synced in Supabase yet; run `npm run db:push`, then `npm run db:seed:experiences`.

If the table exists but admin create/update still fails from the browser, run `supabase/migrations/202607190003_repair_experiences_for_supabase_client.sql` in Supabase SQL Editor. It adds DB defaults, the `updated_at` trigger, RLS policies, and reloads PostgREST schema cache.

To seed the admin login user, set these local/server-only variables and run:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
ADMIN_EMAIL=pathumlk.diz@gmail.com \
ADMIN_PASSWORD=your_admin_password \
npm run seed:admin
```

Use `pathumld.com` for the public portfolio domain and attach `admin.pathumld.com` to the same deployment. The app redirects the admin subdomain root to `/admin`; keep the Supabase environment variables configured on the deployment.
