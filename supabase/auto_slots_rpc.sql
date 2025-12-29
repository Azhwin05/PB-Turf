-- Function to automatically ensure slots exist for the next 7 days
-- This function is SECURITY DEFINER, meaning it runs with admin privileges
-- This allows any user (even anonymous) to trigger the "self-healing" of slots
-- without needing explicit INSERT permissions on the slots table.

create or replace function public.initialize_week_slots()
returns void as $$
declare
  v_court_id uuid;
  v_date date;
BEGIN
  -- 1. Ensure Court Exists (Hardcoded to 'Grand Area Court' for this app)
  INSERT INTO public.court (name) 
  VALUES ('Grand Area Court') 
  ON CONFLICT DO NOTHING;
  
  -- Get the ID
  SELECT id INTO v_court_id FROM public.court WHERE name = 'Grand Area Court' LIMIT 1;

  -- 2. Loop for Today + Next 6 Days (Total 7 days)
  FOR i IN 0..6 LOOP
    v_date := CURRENT_DATE + i;
    -- Call the existing helper to generate slots for this specific day
    PERFORM public.generate_daily_slots(v_court_id, v_date);
  END LOOP;
END;
$$ language plpgsql security definer;
