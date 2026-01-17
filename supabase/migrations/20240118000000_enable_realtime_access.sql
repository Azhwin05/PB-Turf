-- 1. Enable Realtime for the 'bookings' table
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- 2. Enable Row Level Security (if not already enabled)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public Read Access (Essential for Realtime updates to reach everyone)
-- This allows both 'anon' (Anonymous) and 'authenticated' users to SELECT bookings.
CREATE POLICY "Public Read Bookings"
ON bookings FOR SELECT
TO anon, authenticated
USING (true);

-- 4. Policy: Authenticated Insert Access
-- Allows logged-in users to create bookings.
CREATE POLICY "Authenticated Insert Bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Authenticated Update Access (if needed later)
-- Only the owner can update their booking? Or maybe admin?
-- For now, maybe just read/insert is enough for the SlotGrid to update.
