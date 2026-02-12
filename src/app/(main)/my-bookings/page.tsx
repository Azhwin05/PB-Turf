"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Ticket, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Booking {
    id: string;
    status: string;
    payment_status: string;
    slot: {
        id: string;
        start_time: string;
        price: number;
    };
}

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    id,
                    status,
                    payment_status,
                    slot:slots (
                        id,
                        start_time,
                        price
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                // Supabase returns slot as an array sometimes if relation is one-to-many, but here it should be one-to-one or object
                const formattedBookings = data.map((b: any) => ({
                    ...b,
                    slot: Array.isArray(b.slot) ? b.slot[0] : b.slot
                }));
                setBookings(formattedBookings);
            }
            if (error) {
                console.error("Error fetching bookings:", error);
            }
            setLoading(false);
        };

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="p-5 space-y-4 max-w-lg mx-auto pt-safe-top">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-40 w-full rounded-ios-md" />
                <Skeleton className="h-40 w-full rounded-ios-md" />
            </div>
        );
    }

    return (
        <div className="p-5 space-y-6 pb-32 max-w-lg mx-auto">
            <h1 className="text-large-title font-bold text-foreground pt-4">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="pt-20 flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                    <Calendar className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-title-3 font-medium text-muted-foreground">No bookings yet</p>
                    <Button variant="link" className="text-primary text-body" asChild>
                        <Link href="/book">Book your first game</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const startTime = new Date(booking.slot.start_time);
                        return (
                            <Card key={booking.id} className="glass-elevated border-0 shadow-ios-md overflow-hidden press-scale">
                                <CardContent className="p-0">
                                    <div className="p-4 border-b border-border/10 flex justify-between items-start bg-primary/5">
                                        <div className="flex flex-col">
                                            {/* Status Badge Logic */}
                                            {booking.status === 'confirmed' ? (
                                                 <span className="text-caption-1 font-semibold text-primary uppercase tracking-wide">Upcoming</span>
                                            ) : booking.status === 'pending' ? (
                                                <span className="text-caption-1 font-semibold text-warning uppercase tracking-wide">Pending</span>
                                            ) : (
                                                 <span className="text-caption-1 font-semibold text-muted-foreground uppercase tracking-wide">Finished</span>
                                            )}
                                            
                                            <span className="text-title-3 font-bold text-foreground mt-0.5">
                                                {format(startTime, "EEE, dd MMM")}
                                            </span>
                                            <span className="text-body text-muted-foreground">
                                                {format(startTime, "hh:mm a")}
                                            </span>
                                        </div>
                                        <div className={`text-caption-2 px-2 py-1 rounded-full font-bold uppercase border shadow-sm ${
                                            booking.status === 'confirmed' 
                                                ? "bg-success/10 text-success border-success/20 shadow-success-glow" 
                                                : "bg-muted/20 text-muted-foreground border-border/20"
                                        }`}>
                                            {booking.status}
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
                                            <Link href={`/access/${booking.id}`}>
                                                <Ticket className="h-4 w-4 mr-2" />
                                                Ticket
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
