-- Enable Realtime for bookings and slots tables
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.slots;

-- Function to generate slots for a specific date and court
-- Usage: select generate_daily_slots('court_uuid', '2024-01-01');
create or replace function public.generate_daily_slots(
  target_court_id uuid,
  target_date date
) returns void as $$
declare
  start_hour int := 6; -- 6 AM
  end_hour int := 23;  -- 11 PM
  curr_time timestamp;
  slot_duration interval := '1 hour';
begin
  -- Loop from start hour to end hour
  for i in start_hour .. (end_hour - 1) loop
    curr_time := (target_date + make_interval(hours => i));
    
    -- Insert slot if it doesn't exist
    insert into public.slots (court_id, start_time, end_time, price, is_peak)
    values (
      target_court_id,
      curr_time,
      curr_time + slot_duration,
      case 
        when i >= 18 then 1200 -- Peak price (6pm+)
        else 800               -- Standard price
      end,
      case 
        when i >= 18 then true
        else false
      end
    )
    on conflict do nothing; -- Prevent duplicates
  end loop;
end;
$$ language plpgsql;

-- Policy Update: Ensure "pending" bookings are visible to everyone
-- (So users can see who has locked a slot)
drop policy if exists "Users can view own bookings" on public.bookings;

create policy "Anyone can view confirmed or pending bookings"
  on public.bookings for select
  using (true); -- Simplified for demo: allows seeing "locked" status

-- Re-apply insert policy (users can only book for themselves)
drop policy if exists "Users can insert own bookings" on public.bookings;
create policy "Users can insert own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);
