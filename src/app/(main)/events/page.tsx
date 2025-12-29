"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, Calendar, Users, Trophy, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Event = {
    id: string;
    title: string;
    type: "Open Match" | "Tournament" | "Clinic";
    date: string;
    time: string;
    price: number;
    participants: number;
    maxParticipants: number;
    level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([
        {
            id: "1",
            title: "Saturday Smash Open",
            type: "Open Match",
            date: "Sat, Oct 28",
            time: "06:00 PM - 08:00 PM",
            price: 200,
            participants: 3,
            maxParticipants: 4,
            level: "Intermediate"
        },
        {
            id: "2",
            title: "Beginner Clinic",
            type: "Clinic",
            date: "Sun, Oct 29",
            time: "10:00 AM - 12:00 PM",
            price: 500,
            participants: 2,
            maxParticipants: 8,
            level: "Beginner"
        },
        {
            id: "3",
            title: "Monthly Championship",
            type: "Tournament",
            date: "Fri, Nov 03",
            time: "05:00 PM - 09:00 PM",
            price: 1000,
            participants: 12,
            maxParticipants: 16,
            level: "Advanced"
        }
    ]);

    const handleJoin = (id: string) => {
        // Simulate API call
        setEvents(prev => prev.map(e => {
            if (e.id === id && e.participants < e.maxParticipants) {
                return { ...e, participants: e.participants + 1 };
            }
            return e;
        }));
        alert("You have joined the event!");
    };

    return (
        <div className="p-5 space-y-6 pb-32">
            <div className="flex justify-between items-center pt-4">
                <h1 className="text-large-title font-bold text-foreground">Community</h1>
                <Button variant="outline" size="sm" className="h-8 text-caption-1 font-medium rounded-ios-sm">My Events</Button>
            </div>

            <div className="space-y-5">
                {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden glass-elevated group press-scale border-0 shadow-ios-sm">
                        <div className={cn("h-1.5 w-full",
                            event.type === "Open Match" ? "bg-success" :
                                event.type === "Tournament" ? "bg-warning" : "bg-primary"
                        )} />
                        <CardHeader className="pb-3 pt-4 px-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={cn("text-caption-2 font-bold uppercase tracking-wider px-2 py-0.5 rounded-ios-sm mb-2 inline-block backdrop-blur-md bg-opacity-20",
                                        event.type === "Open Match" ? "bg-success/10 text-success border border-success/20" :
                                            event.type === "Tournament" ? "bg-warning/10 text-warning border border-warning/20" : "bg-primary/10 text-primary border border-primary/20"
                                    )}>
                                        {event.type}
                                    </span>
                                    <CardTitle className="text-title-3 font-bold text-foreground">{event.title}</CardTitle>
                                </div>
                                <div className="text-center glass-subtle px-3 py-1.5 rounded-ios-sm min-w-[4rem]">
                                    <p className="text-callout font-bold text-foreground">₹{event.price}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-4 px-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-subheadline text-muted-foreground">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{event.date} • {event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-subheadline text-muted-foreground">
                                    <Trophy className="h-4 w-4 text-warning" />
                                    <span>Level: {event.level}</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-caption-1 text-muted-foreground font-medium">
                                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Participants</span>
                                    <span>{event.participants}/{event.maxParticipants}</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-500 ease-spring",
                                            event.type === "Open Match" ? "bg-success shadow-success-glow" :
                                                event.type === "Tournament" ? "bg-warning shadow-warning-glow" : "bg-primary shadow-primary-glow"
                                        )}
                                        style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-5 px-5">
                            <Button
                                className={cn("w-full transition-all duration-300 shadow-ios font-semibold rounded-ios-md h-11",
                                    event.participants >= event.maxParticipants ? "opacity-50" : "hover:shadow-primary-glow"
                                )}
                                onClick={() => handleJoin(event.id)}
                                disabled={event.participants >= event.maxParticipants}
                                variant={event.participants >= event.maxParticipants ? "secondary" : "default"}
                            >
                                {event.participants >= event.maxParticipants ? "Full" : "Join Event"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
