# Pickleball Arena PWA

A mobile-first Progressive Web App (PWA) for managing bookings, events, and memberships for a single pickleball court.

## Features
- **Mobile First Design**: Optimized for touch, speed, and installability.
- **Smart Booking**: Visual slot grid, date picker, and "no empty slot" yield management.
- **Access Control**: Dynamic QR/Passcode generation for valid bookings.
- **Community**: Event listings, tournaments, and XP-based leaderboards.
- **Admin Dashboard**: Mobile-ready admin tools for schedule management and access definition.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- Supabase Account

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
1. Go to your Supabase project SQL Editor.
2. Run the migrations in `supabase/migrations` in order:
    - `..._initial_schema.sql`
    - `..._membership_events.sql`
    - `..._system_logs.sql`
    - `..._auth_trigger.sql`
3. (Optional) Run `supabase/seed.sql` to populate initial data.

### 5. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 6. Building for Production
```bash
npm run build
npm start
```

## Admin Access
(Note: RLS policies currently allow public sign-up. You would manually set a user's role to 'admin' in the `profiles` table to access `/admin` routes if strictly enforcing role checks in middleware, which is ready to be uncommented in `src/middleware.ts`).

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, DB, Realtime)
- Radix UI / Lucide React
