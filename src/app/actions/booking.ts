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
            console.warn("bookSlot: Race condition hit for slot:", slotId);
            return { success: false, message: "This slot was just booked by someone else." };
        }
        console.error("bookSlot: Insert error:", error);
        return { success: false, message: "Failed to book slot. Please try again." };
    }
    console.log("bookSlot: Insert successful for slot:", slotId, "User:", user.id);


    // 4. Success
    revalidatePath("/book");
    return { success: true, message: "Slot locked! Proceeding to payment..." };
}

export async function confirmBooking(slotId: string) {
    console.log("Starting confirmBooking for slot:", slotId);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("confirmBooking: User not found");
        return { success: false, message: "Unauthorized" };
    }
    console.log("confirmBooking: User found:", user.id);

    // Update status to 'confirmed' (Simulating Payment Success)
    const { data, error } = await supabase
        .from("bookings")
        .update({ status: "confirmed", payment_status: "paid" })
        .eq("slot_id", slotId)
        .eq("user_id", user.id)
        .select(); // Add select to see if row was actually updated

    if (error) {
        console.error("confirmBooking: Update error:", error);
        return { success: false, message: "Failed to confirm booking: " + error.message };
    }

    if (!data || data.length === 0) {
        console.error("confirmBooking: No rows updated! Possible RLS or ID mismatch.");
        console.error("Query params - slotId:", slotId, "userId:", user.id);
        return { success: false, message: "Booking not found or access denied." };
    }

    console.log("confirmBooking: Success!", data);

    revalidatePath("/book");
    revalidatePath("/my-bookings");
    return { success: true, message: "Booking Confirmed Successfully!" };
}
