-- Add UPDATE policy for bookings table
-- This is required because confirmBooking() updates status and payment_status
-- and RLS is enabled.

CREATE POLICY "Authenticated Update Bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
