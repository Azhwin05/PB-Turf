"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ChevronRight, Ticket } from "lucide-react";
import Link from 'next/link';

export default function MyBookingsPage() {
    return (
        <div className="p-5 space-y-6 pb-32">
            <h1 className="text-large-title font-bold text-foreground pt-4">My Bookings</h1>

            <div className="space-y-4">
                {/* Mock Booking Card */}
                <Card className="glass-elevated border-0 shadow-ios-md overflow-hidden press-scale">
                    <CardContent className="p-0">
                        <div className="p-4 border-b border-border/10 flex justify-between items-start bg-primary/5">
                            <div className="flex flex-col">
                                <span className="text-caption-1 font-semibold text-primary uppercase tracking-wide">Upcoming</span>
                                <span className="text-title-3 font-bold text-foreground mt-0.5">Mon, 28 Oct</span>
                                <span className="text-body text-muted-foreground">06:00 PM</span>
                            </div>
                            <div className="bg-success/10 text-success text-caption-2 px-2 py-1 rounded-full font-bold uppercase border border-success/20 shadow-success-glow">
                                Confirmed
                            </div>
                        </div>

                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3 text-subheadline text-muted-foreground">
                                <div className="h-8 w-8 rounded-full bg-muted/20 flex items-center justify-center">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-foreground">Pickleball Arena, Downtown</span>
                            </div>
                            <div className="flex items-center gap-3 text-subheadline text-muted-foreground">
                                <div className="h-8 w-8 rounded-full bg-muted/20 flex items-center justify-center">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-foreground">1 Hour Session</span>
                            </div>
                        </div>

                        <div className="p-4 pt-0 flex gap-3">
                            <Button asChild variant="secondary" className="flex-1 rounded-ios-md font-semibold bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary shadow-none h-10">
                                <Link href="/access/mock-id">
                                    <Ticket className="h-4 w-4 mr-2" />
                                    Ticket
                                </Link>
                            </Button>
                            <Button variant="ghost" className="flex-1 rounded-ios-md font-semibold text-muted-foreground hover:bg-muted/10 h-10">
                                Reschedule
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="pt-8 flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-body font-medium text-muted-foreground">No more upcoming bookings</p>
                    <Button variant="link" className="text-primary" asChild>
                        <Link href="/book">Book a new slot</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
