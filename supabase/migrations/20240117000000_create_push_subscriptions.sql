-- Create table for storing push subscriptions
create table public.push_subscriptions (
  id uuid not null default gen_random_uuid (),
  user_id uuid references auth.users (id) on delete cascade not null,
  subscription jsonb not null,
  created_at timestamp with time zone not null default now(),
  constraint push_subscriptions_pkey primary key (id),
  constraint push_subscriptions_user_id_key unique (user_id)
);

-- RLS Policies
alter table public.push_subscriptions enable row level security;

create policy "Users can insert their own subscription"
  on public.push_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own subscription"
  on public.push_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can update their own subscription"
  on public.push_subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own subscription"
  on public.push_subscriptions for delete
  using (auth.uid() = user_id);
