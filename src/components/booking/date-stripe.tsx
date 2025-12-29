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
        for (let i = 0; i < 5; i++) {
            d.push(addDays(today, i));
        }
        setDates(d);
    }, []);

    return (
        <div className="grid grid-cols-5 gap-2 w-full">
            {dates.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                return (
                    <button
                        key={date.toISOString()}
                        onClick={() => onSelectDate(date)}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-16 rounded-ios transition-all duration-300 ease-spring press-scale",
                            isSelected
                                ? "bg-primary text-primary-foreground shadow-primary-glow scale-105 z-10 font-bold"
                                : "glass-card text-foreground hover:glass-elevated"
                        )}
                    >
                        <span className="text-[10px] uppercase tracking-wider opacity-80 mb-0.5">{format(date, "EEE")}</span>
                        <span className="text-title-3 leading-none">{format(date, "d")}</span>
                    </button>
                )
            })}
        </div>
    );
}

