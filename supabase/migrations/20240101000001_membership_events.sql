-- Membership Plans
create table public.membership_plans (
  id uuid default gen_random_uuid() primary key,
  name text not null unique, -- Silver, Gold, Pro
  price_monthly numeric not null,
  benefits jsonb not null, -- { "discount_percent": 10, "priority_hours": 24 }
  created_at timestamptz default now()
);

-- Memberships
create table public.memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  plan_id uuid references public.membership_plans(id) not null,
  start_date timestamptz default now(),
  end_date timestamptz,
  status text default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz default now()
);

-- Events
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_type text check (event_type in ('Open Match', 'Mini League', 'Tournament', 'Clinic')),
  court_id uuid references public.court(id) not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  max_participants int default 4,
  current_participants int default 0,
  price_per_person numeric default 0,
  status text default 'scheduled' check (status in ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- Event Participants
create table public.event_participants (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) not null,
  user_id uuid references public.profiles(id) not null,
  status text default 'registered' check (status in ('registered', 'waitlist', 'checked_in')),
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

-- RLS
alter table public.membership_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;

-- Policies
create policy "Plans viewable by everyone" on membership_plans for select using (true);
create policy "Users view own membership" on memberships for select using (auth.uid() = user_id);
create policy "Events viewable by everyone" on events for select using (true);
create policy "Users view event participants" on event_participants for select using (true);
create policy "Users can join events" on event_participants for insert with check (auth.uid() = user_id);
