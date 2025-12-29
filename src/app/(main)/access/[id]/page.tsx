"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Copy, CheckCircle, ChevronLeft, Share2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccessPage() {
    // useParams hook returns ReadonlyURLSearchParams which is synchronous in Client Components
    // But type checking might be strict about it being potentially undefined
    const params = useParams();
    const id = params?.id as string;
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Mock Data
    const [ticket, setTicket] = useState({
        passcode: "123456",
        status: "VALID",
        validUntil: new Date().setHours(new Date().getHours() + 1),
        courtName: "Pickleball Arena"
    });

    useEffect(() => {
        // Simulate fetch
        setTicket({
            passcode: Math.floor(100000 + Math.random() * 900000).toString(),
            status: "VALID",
            validUntil: new Date().setHours(new Date().getHours() + 1),
            courtName: "Pickleball Arena"
        });
        setLoading(false);
    }, [id]);

    const copyPasscode = () => {
        navigator.clipboard.writeText(ticket.passcode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-[80vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="p-5 flex flex-col items-center min-h-screen pb-10 bg-background text-foreground">
            <div className="w-full max-w-sm mb-6 flex items-center justify-between">
                <Link href="/my-bookings" className="p-2 -ml-2 rounded-full hover:bg-muted/20 transition-colors text-primary">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-body font-semibold">Access Pass</h1>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-muted/20 rounded-full">
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>

            <Card className="w-full max-w-sm glass-liquid border-0 shadow-ios-xl overflow-hidden relative">
                <div className="shimmer-overlay" />
                {/* Decorative top stripe */}
                <div className="h-2 w-full bg-gradient-to-r from-primary to-blue-400" />

                <CardHeader className="text-center border-b border-border/50 pb-6 bg-muted/5">
                    <CardTitle className="text-title-2 font-bold text-foreground tracking-tight">{ticket.courtName}</CardTitle>
                    <CardDescription className="text-caption-1 font-medium text-muted-foreground uppercase tracking-wider mt-1">
                        Booking ID: <span className="text-foreground tracking-widest">{id.toString().substring(0, 8).toUpperCase()}</span>
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center p-8 space-y-8">
                    <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200">
                        <QRCodeSVG value={`ACCESS:${id}:${ticket.passcode}`} size={180} />
                    </div>

                    <div className="text-center w-full space-y-3">
                        <p className="text-caption-1 uppercase tracking-widest text-muted-foreground font-semibold">Entry Passcode</p>
                        <div className="flex items-center justify-center gap-3 bg-muted/30 py-3 rounded-ios-md border border-white/5">
                            <span className="text-large-title font-mono font-bold tracking-[0.2em] text-foreground">{ticket.passcode}</span>
                            <Button variant="ghost" size="icon" onClick={copyPasscode} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="w-full bg-success/10 text-success py-2.5 px-4 rounded-full text-center text-callout font-bold flex items-center justify-center gap-2 shadow-success-glow border border-success/20">
                        <div className="h-2 w-2 bg-success rounded-full animate-pulse shadow-[0_0_8px_currentColor]" />
                        {ticket.status}
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 text-center space-y-4 max-w-xs">
                <p className="text-caption-1 text-muted-foreground text-center leading-relaxed">
                    This ticket is valid until <span className="text-foreground font-semibold">{new Date(ticket.validUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>.<br />
                    Please arrive 10 minutes early.
                </p>
                <Button className="w-full bg-black text-white hover:bg-slate-900 rounded-ios-md h-12 shadow-ios-md flex items-center justify-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Add to Apple Wallet
                </Button>
            </div>
        </div>
    );
}
