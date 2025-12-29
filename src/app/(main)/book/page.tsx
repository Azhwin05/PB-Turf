"use client";

import { useState, useEffect } from "react";
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
            setSlots([]);

            const mockSlots: Slot[] = [];
            const baseTime = startOfDay(selectedDate);
            for (let i = 6; i <= 22; i++) {
                const startTime = addHours(baseTime, i);
                const endTime = addHours(baseTime, i + 1);

                const rand = Math.random();
                let status: Slot['status'] = 'available';
                if (rand > 0.8) status = 'booked';
                else if (rand > 0.9) status = 'deal';

                mockSlots.push({
                    id: `slot-${i}-${selectedDate.getDate()}`,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    price: status === 'deal' ? 400 : 800,
                    status: status,
                    isPeak: i >= 18 || i <= 8
                });
            }
            setSlots(mockSlots);
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

        // await new Promise(r => setTimeout(r, 1000));

        alert(`Booking Confirmed for Slot ID: ${selectedSlotId}`);
        setBookingLoading(false);
        router.push("/my-bookings");
    };

    const selectedSlot = slots.find(s => s.id === selectedSlotId);

    return (
        <div className="flex flex-col h-screen max-h-screen bg-background text-foreground pb-safe-bottom">
            <div className="w-full max-w-md mx-auto">
                <div className="px-5 py-2 glass-nav sticky top-0 z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted/20 transition-colors">
                            <ChevronLeft className="h-6 w-6 text-primary" />
                        </Link>
                        <h1 className="text-title-2 font-bold text-foreground">Book a Slot</h1>
                    </div>
                    <p className="text-subheadline text-muted-foreground font-medium">{format(selectedDate, "EEEE, MMMM do")}</p>
                </div>
            </div>

            <div className="py-6">
                <DateStripe selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>

            <div className="flex-1 overflow-y-auto">
                <SlotGrid
                    slots={slots}
                    loading={loading}
                    selectedSlotId={selectedSlotId}
                    onSelectSlot={setSelectedSlotId}
                />
            </div>

            {/* Bottom Action Bar */}
            {selectedSlotId && (
                <div className="fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto">
                    <div className="glass-floating p-4 rounded-ios-xl shadow-ios-xl flex items-center justify-between animate-slide-up">
                        <div>
                            <p className="text-caption-1 text-muted-foreground uppercase tracking-wide font-semibold">Total</p>
                            <p className="text-title-3 font-bold text-primary">₹{selectedSlot?.price}</p>
                        </div>
                        <Button onClick={handleConfirmBooking} disabled={bookingLoading} size="lg" className="px-8 shadow-primary-glow font-semibold rounded-ios-md">
                            {bookingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Confirm Booking
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
