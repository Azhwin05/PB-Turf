"use strict";
"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Moon, Sun, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { bookSlot } from "@/app/actions/booking";
import { toast } from "sonner"; // Assuming you have sonner or some toast

export type Slot = {
    id: string;
    startTime: string; // ISO string
    endTime: string;
    price: number;
    status: "available" | "booked" | "event" | "deal" | "locked";
    isPeak: boolean;
};

interface SlotGridProps {
    slots: Slot[];
    loading: boolean;
    selectedSlotId?: string;
    onSelectSlot: (slotId: string) => void;
}

export function SlotGrid({ slots, loading, selectedSlotId, onSelectSlot }: SlotGridProps) {
    const [lockedSlotIds, setLockedSlotIds] = useState<string[]>([]);
    const [isBooking, setIsBooking] = useState(false);

    // Realtime Subscription
    useEffect(() => {
        const channel = supabase
            .channel('realtime:bookings')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'bookings' },
                (payload) => {
                    const newBooking = payload.new as { slot_id: string, status: string };
                    if (newBooking.status === 'pending') {
                        setLockedSlotIds((prev) => [...prev, newBooking.slot_id]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleSlotClick = async (slotId: string) => {
        setIsBooking(true);
        // Optimistic update
        onSelectSlot(slotId);

        try {
            const result = await bookSlot(slotId);
            if (!result.success) {
                // Handle error (e.g. show toast)
                console.error(result.message);
                // toast.error(result.message);
            } else {
                // Success - Server Action revalidates path, Realtime updates other clients
                // For this client, we might navigate to payment or show success
                // toast.success("Slot locked!");
            }
        } catch (e) {
            console.error("Booking failed", e);
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-3 px-5 pb-32 animate-fade-in">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass-card rounded-ios-md p-4 h-[100px] flex flex-col justify-between">
                        <div className="flex justify-between w-full mb-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </div>
                        <div className="flex justify-between w-full items-end">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-5 w-10" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (slots.length === 0) {
        return <div className="text-center p-8 text-muted-foreground text-subheadline">No slots available for this date.</div>;
    }

    return (
        <div className="grid grid-cols-2 gap-3 pb-32">
            {slots.map((slot) => {
                const startTime = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                // Determine effective status based on Realtime data
                const isLockedRealtime = lockedSlotIds.includes(slot.id);
                const effectiveStatus = isLockedRealtime ? 'locked' : slot.status;

                const isSelected = selectedSlotId === slot.id;
                const isAvailable = effectiveStatus === 'available' || effectiveStatus === 'deal';
                const isLocked = effectiveStatus === 'locked';

                return (
                    <button
                        key={slot.id}
                        disabled={!isAvailable}
                        onClick={() => handleSlotClick(slot.id)}
                        className={cn(
                            "relative flex flex-col items-start p-4 rounded-ios-md transition-all duration-300 ease-spring text-left group min-h-[100px] justify-between press-scale",
                            isSelected
                                ? "bg-primary/10 border-2 border-primary shadow-primary-glow z-10"
                                : "glass-card hover:glass-elevated",
                            !isAvailable && "opacity-40 cursor-not-allowed grayscale",
                            // Locking visuals (Yellow)
                            isLocked && "border-2 border-yellow-500/50 bg-yellow-500/10 opacity-60",
                            slot.status === 'deal' && !isSelected && "border-2 border-warning/30 bg-warning/5 shadow-warning-glow"
                        )}
                    >
                        <div className="flex justify-between w-full mb-1">
                            <span className={cn(
                                "text-title-3 font-semibold",
                                isSelected ? "text-primary" : "text-foreground"
                            )}>{startTime}</span>
                            {slot.isPeak ?
                                <Moon className="h-4 w-4 text-primary/60" /> :
                                <Sun className="h-4 w-4 text-warning/80" />
                            }
                        </div>
                        <div className="flex justify-between w-full items-end mt-2">
                            <div>
                                {slot.status === 'deal' && (
                                    <span className="text-caption-2 font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded-ios-sm border border-warning/20">
                                        DEAL
                                    </span>
                                )}
                                {isLocked && (
                                    <div className="flex items-center gap-1 text-yellow-600">
                                        <Lock className="h-3 w-3" />
                                        <span className="text-caption-2 font-medium">LOCKED</span>
                                    </div>
                                )}
                                {slot.status === 'booked' && (
                                    <span className="text-caption-2 font-medium text-muted-foreground glass-subtle px-2 py-1 rounded-ios-sm">
                                        BOOKED
                                    </span>
                                )}
                            </div>
                            <span className={cn(
                                "text-callout font-semibold",
                                slot.status === 'deal' ? "text-warning" : "text-muted-foreground group-hover:text-foreground transition-colors"
                            )}>
                                ₹{slot.price}
                            </span>
                        </div>
                    </button>
                )
            })}
        </div>
    );
}
