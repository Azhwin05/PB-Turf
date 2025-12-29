"use client";

import { useState, useEffect } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface DateStripeProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export function DateStripe({ selectedDate, onSelectDate }: DateStripeProps) {
    const [dates, setDates] = useState<Date[]>([]);

    useEffect(() => {
        const d = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            d.push(addDays(today, i));
        }
        setDates(d);
    }, []);

    return (
        <div className="flex overflow-x-auto pb-4 gap-3 px-5 no-scrollbar">
            {dates.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                return (
                    <button
                        key={date.toISOString()}
                        onClick={() => onSelectDate(date)}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[4.5rem] h-16 rounded-ios transition-all duration-300 ease-spring press-scale",
                            isSelected
                                ? "bg-primary text-primary-foreground shadow-primary-glow scale-105"
                                : "glass-card text-foreground hover:glass-elevated"
                        )}
                    >
                        <span className="text-caption-1 font-medium uppercase tracking-wider opacity-70">{format(date, "EEE")}</span>
                        <span className="text-title-3 font-semibold">{format(date, "d")}</span>
                    </button>
                )
            })}
        </div>
    );
}

