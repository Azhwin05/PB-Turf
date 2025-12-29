-- Seed slots for the next 7 days for the "Grand Area Court"
DO $$
DECLARE
  v_court_id uuid;
  v_date date;
BEGIN
  -- 1. Ensure Court Exists
  INSERT INTO public.court (name) 
  VALUES ('Grand Area Court') 
  ON CONFLICT DO NOTHING;
  
  SELECT id INTO v_court_id FROM public.court WHERE name = 'Grand Area Court' LIMIT 1;

  -- 2. Loop for next 7 days
  FOR i IN 0..6 LOOP
    v_date := CURRENT_DATE + i;
    PERFORM public.generate_daily_slots(v_court_id, v_date);
  END LOOP;
END $$;
