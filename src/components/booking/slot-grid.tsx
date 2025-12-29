"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Moon, Sun } from "lucide-react";

export type Slot = {
    id: string;
    startTime: string; // ISO string
    endTime: string;
    price: number;
    status: "available" | "booked" | "event" | "deal";
    isPeak: boolean;
};

interface SlotGridProps {
    slots: Slot[];
    loading: boolean;
    selectedSlotId?: string;
    onSelectSlot: (slotId: string) => void;
}

export function SlotGrid({ slots, loading, selectedSlotId, onSelectSlot }: SlotGridProps) {
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
        <div className="w-full max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-3 px-5 pb-32">
                {slots.map((slot) => {
                    const startTime = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const isSelected = selectedSlotId === slot.id;
                    const isAvailable = slot.status === 'available' || slot.status === 'deal';

                    return (
                        <button
                            key={slot.id}
                            disabled={!isAvailable}
                            onClick={() => onSelectSlot(slot.id)}
                            className={cn(
                                "relative flex flex-col items-start p-4 rounded-ios-md transition-all duration-300 ease-spring text-left group min-h-[100px] justify-between press-scale",
                                isSelected
                                    ? "bg-primary/10 border-2 border-primary shadow-primary-glow z-10"
                                    : "glass-card hover:glass-elevated",
                                !isAvailable && "opacity-40 cursor-not-allowed grayscale",
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
        </div>
    );
}

