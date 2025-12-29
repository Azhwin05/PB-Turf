"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function bookSlot(slotId: string) {
    const supabase = await createClient();

    // 1. Check Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "You must be logged in to book." };
    }

    // 2. Attempt to Lock Slot (Insert Pending Booking)
    const { error } = await supabase
        .from("bookings")
        .insert({
            user_id: user.id,
            slot_id: slotId,
            status: "pending",               // Sets the "Lock"
            payment_status: "pending"
        });

    if (error) {
        // 3. Handle Race Conditions
        if (error.code === '23505') { // Postgres code for Unique Violation
            return { success: false, message: "This slot was just booked by someone else." };
        }
        console.error("Booking error:", error);
        return { success: false, message: "Failed to book slot. Please try again." };
    }

    // 4. Success
    revalidatePath("/book");
    return { success: true, message: "Slot locked! Proceeding to payment..." };
}

export async function confirmBooking(slotId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    // Update status to 'confirmed' (Simulating Payment Success)
    const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed", payment_status: "paid" })
        .eq("slot_id", slotId)
        .eq("user_id", user.id); // Security: Ensure user owns the lock

    if (error) {
        console.error("Confirmation error:", error);
        return { success: false, message: "Failed to confirm booking." };
    }

    revalidatePath("/book");
    revalidatePath("/my-bookings");
    return { success: true, message: "Booking Confirmed Successfully!" };
}
