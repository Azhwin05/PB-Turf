-- Access Tokens (QR/PIN)
create table public.access_tokens (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) not null,
  token_value text not null, -- The QR content or PIN
  token_type text default 'pin' check (token_type in ('qr', 'pin')),
  valid_from timestamptz not null,
  valid_until timestamptz not null,
  status text default 'valid' check (status in ('valid', 'used', 'expired', 'revoked')),
  created_at timestamptz default now()
);

-- Access Logs
create table public.access_logs (
  id uuid default gen_random_uuid() primary key,
  token_id uuid references public.access_tokens(id),
  scanned_at timestamptz default now(),
  status text check (status in ('granted', 'denied')),
  reason text
);

-- Notifications
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  message text,
  type text default 'info', -- booking_confirmed, alert, reminder
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Push Subscriptions
create table public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now(),
  unique(user_id, endpoint)
);

-- Audit Logs (Admin actions)
create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  action text not null,
  details jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table public.access_tokens enable row level security;
alter table public.access_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.audit_logs enable row level security;

-- Policies
create policy "Users see own access tokens" on access_tokens for select using (
  exists (select 1 from bookings where bookings.id = access_tokens.booking_id and bookings.user_id = auth.uid())
);
create policy "Users see own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users manage own subscriptions" on push_subscriptions for all using (auth.uid() = user_id);
-- Admin can see logs, etc (omitted for brevity)
