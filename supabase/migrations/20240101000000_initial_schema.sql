-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  phone text,
  skill_level text check (skill_level in ('Beginner', 'Intermediate', 'Advanced', 'Pro')),
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Create court table
create table public.court (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text,
  operating_hours jsonb, -- { "open": "06:00", "close": "23:00" }
  created_at timestamptz default now()
);

-- Create slots table
create table public.slots (
  id uuid default gen_random_uuid() primary key,
  court_id uuid references public.court not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  price numeric not null,
  status text default 'available' check (status in ('available', 'booked', 'event', 'deal', 'maintenance')),
  is_peak boolean default false,
  created_at timestamptz default now(),
  constraint no_overlap exclude using gist (court_id with =, tstzrange(start_time, end_time) with &&)
);

-- Create bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  slot_id uuid references public.slots(id) not null,
  status text default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status text default 'pending',
  created_at timestamptz default now(),
  unique(slot_id) -- Prevent double booking on same slot
);

-- RLS
alter table public.profiles enable row level security;
alter table public.court enable row level security;
alter table public.slots enable row level security;
alter table public.bookings enable row level security;

-- Policies
-- Profiles: Users can read own, Admin read all. Public can read basic info if needed?
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Court: Public read, Admin write
create policy "Court is viewable by everyone" on court for select using (true);

-- Slots: Public read, Admin write
create policy "Slots are viewable by everyone" on slots for select using (true);
-- Admin write policy would go here (requires logic to check role)

-- Bookings: Users can read own, Admin read all
create policy "Users can view own bookings" on bookings for select using (auth.uid() = user_id);
create policy "Users can insert own bookings" on bookings for insert with check (auth.uid() = user_id);
