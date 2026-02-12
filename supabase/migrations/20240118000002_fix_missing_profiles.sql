-- Backfill missing profiles for existing users
-- Run this if you get "Key is not present in table profiles" errors.

INSERT INTO public.profiles (id, full_name, phone)
SELECT 
  id, 
  raw_user_meta_data->>'full_name', 
  phone
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
