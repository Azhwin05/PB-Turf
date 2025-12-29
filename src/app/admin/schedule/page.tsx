"use client";

import { DateStripe } from "@/components/booking/date-stripe";
import { SlotGrid, type Slot } from "@/components/booking/slot-grid";
import { useState, useEffect } from "react";
import { addHours, startOfDay } from "date-fns";

export default function AdminSchedulePage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Reuse logic from booking page basically, but with Admin powers
        // For prototype, we copy-paste mock logic
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
    }, [selectedDate]);

    return (
        <div className="flex flex-col h-screen max-h-screen bg-background text-foreground pb-safe-bottom">
            <div className="w-full max-w-md mx-auto">
                <div className="px-5 py-2 glass-nav sticky top-0 z-10">
                    <h1 className="text-title-2 font-bold text-foreground mb-2">Manage Schedule</h1>
                </div>
            </div>

            <div className="py-2">
                <DateStripe selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>

            <div className="flex-1 overflow-y-auto pt-2">
                <SlotGrid
                    slots={slots}
                    loading={loading}
                    onSelectSlot={(id) => alert(`Function to edit slot ${id}`)}
                />
            </div>
        </div>
    );
}
