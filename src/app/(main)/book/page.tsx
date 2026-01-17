"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DateStripe } from "@/components/booking/date-stripe";
import { SlotGrid, type Slot } from "@/components/booking/slot-grid";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { format, addHours, startOfDay, endOfDay } from "date-fns";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BookPage() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>(undefined);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            setSlots([]);

            // 1. AUTO-GENERATION: Ensure slots exist for the week (Lazy Load)
            // This RPC call ensures that if we are viewing a new day, slots are created instantly.
            const { error: rpcError } = await supabase.rpc('initialize_week_slots');
            if (rpcError) {
                console.warn("Auto-slot generation failed (might be missing SQL function):", rpcError);
                // Continue anyway, maybe slots exist
            }

            const start = startOfDay(selectedDate).toISOString();
            const end = endOfDay(selectedDate).toISOString();

            const { data, error } = await supabase
                .from('slots')
                .select('*')
                .gte('start_time', start)
                .lte('start_time', end)
                .order('start_time', { ascending: true });

            if (error) {
                console.error("Error fetching slots:", error);
                setLoading(false);
                return;
            }

            if (data) {
                const realSlots: Slot[] = data.map(dbSlot => ({
                    id: dbSlot.id,
                    startTime: dbSlot.start_time,
                    endTime: dbSlot.end_time,
                    price: Number(dbSlot.price),
                    status: dbSlot.status as Slot['status'], // 'available' | 'booked' | 'event' | 'deal'
                    isPeak: dbSlot.is_peak
                }));
                setSlots(realSlots);
            }
            setLoading(false);
        };

        fetchSlots();
        setSelectedSlotId(undefined);
    }, [selectedDate]);

    const handleConfirmBooking = async () => {
        if (!selectedSlotId) return;
        setBookingLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        const { confirmBooking } = await import("@/app/actions/booking");
        const result = await confirmBooking(selectedSlotId);

        if (result.success) {
            toast.success("Booking Confirmed! 🎉");
            router.push("/my-bookings");
        } else {
            toast.error(result.message);
        }
        setBookingLoading(false);
    };

    const selectedSlot = slots.find(s => s.id === selectedSlotId);

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-80px)] bg-background relative">

            {/* Header */}
            <div className="px-5 py-4 glass-nav sticky top-0 z-20 shrink-0 border-b border-border/50">
                <div className="flex items-center gap-3 mb-1">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted/10 transition-colors">
                        <ChevronLeft className="h-6 w-6 text-foreground" />
                    </Link>
                    <h1 className="text-title-3 font-bold text-foreground tracking-tight">Book a Slot</h1>
                </div>
                <p className="text-title-2 font-bold text-primary px-1 pb-1 leading-tight">
                    {format(selectedDate, "EEEE, MMMM do")}
                </p>
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 pb-32 w-full px-5">
                <div className="py-4">
                    <DateStripe selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                </div>

                <div>
                    <SlotGrid
                        slots={slots}
                        loading={loading}
                        selectedSlotId={selectedSlotId}
                        onSelectSlot={setSelectedSlotId}
                    />
                </div>
            </div>

            {/* Bottom Action Bar */}
            {selectedSlotId && (
                <div className="fixed bottom-24 left-0 right-0 z-30 px-4">
                    {/* Constrain fixed element to match layout width if needed, or rely on parent */}
                    <div className="glass-floating p-4 rounded-ios-xl shadow-ios-xl flex items-center justify-between border border-white/10 backdrop-blur-xl md:max-w-md md:mx-auto">
                        <div>
                            <p className="text-caption-1 text-muted-foreground uppercase tracking-wide font-semibold">Total</p>
                            <p className="text-title-2 font-bold text-primary">₹{selectedSlot?.price}</p>
                        </div>
                        <Button onClick={handleConfirmBooking} disabled={bookingLoading} size="lg" className="px-8 shadow-primary-glow font-semibold rounded-ios-md">
                            {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Confirm
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
