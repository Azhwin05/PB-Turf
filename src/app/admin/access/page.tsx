"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ScanLine, CheckCircle, XCircle, Camera, Keyboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdminAccessPage() {
    const [passcode, setPasscode] = useState("");
    const [scanning, setScanning] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle");
    const [scannedData, setScannedData] = useState<string | null>(null);

    const handleVerify = async (code: string) => {
        setVerificationStatus("verifying");
        // Mock verification logic
        await new Promise(r => setTimeout(r, 1500));

        if (code === "123456" || code.includes("booking-")) {
            setVerificationStatus("valid");
        } else {
            setVerificationStatus("invalid");
        }
        setScanning(false);
    };

    const handleScan = (result: any) => {
        if (result) {
            const raw = result[0]?.rawValue;
            if (raw && raw !== scannedData) {
                setScannedData(raw);
                handleVerify(raw);
            }
        }
    };

    return (
        <div className="p-5 space-y-6 pb-20 h-screen flex flex-col">
            <div className="text-center space-y-2 pt-4">
                <h1 className="text-large-title font-bold text-foreground">Access Scanner</h1>
                <p className="text-subheadline text-muted-foreground">Scan entry passes</p>
            </div>

            {/* Scanner Area */}
            <div className="relative flex-1 rounded-ios-xl overflow-hidden shadow-ios-xl bg-black border border-white/10">
                {scanning ? (
                    <div className="w-full h-full relative">
                        <Scanner
                            onScan={handleScan}
                            styles={{ container: { height: '100%' } }}
                        />
                        {/* Viewfinder Overlay */}
                        <div className="absolute inset-0 border-2 border-primary/50 pointer-events-none">
                            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-3xl" />
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-3xl" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-3xl" />
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-3xl" />
                        </div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                            <Button
                                variant="destructive"
                                size="lg"
                                className="rounded-full shadow-lg font-semibold px-8"
                                onClick={() => setScanning(false)}
                            >
                                Stop Camera
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-6 glass-subtle">
                        <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                            <Camera className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <Button onClick={() => setScanning(true)} size="lg" className="h-14 px-8 rounded-ios-lg font-bold text-body shadow-primary-glow">
                            Tap to Scan
                        </Button>
                    </div>
                )}

                {/* Verification Overlay */}
                {verificationStatus !== "idle" && (
                    <div className="absolute inset-x-4 top-4 z-50 animate-slide-up">
                        <Card className={cn("border-0 shadow-ios-xl backdrop-blur-xl",
                            verificationStatus === 'valid' ? 'bg-success/90 text-white' :
                                verificationStatus === 'invalid' ? 'bg-destructive/90 text-white' : 'glass-elevated'
                        )}>
                            <CardContent className="p-6">
                                {verificationStatus === "verifying" && (
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <p className="text-body font-medium text-muted-foreground">Verifying access...</p>
                                    </div>
                                )}
                                {verificationStatus === "valid" && (
                                    <div className="flex flex-col items-center gap-2">
                                        <CheckCircle className="h-12 w-12 text-white fill-white/20" />
                                        <h3 className="text-title-2 font-bold">Access Granted</h3>
                                        <div className="bg-white/20 px-3 py-1 rounded-full text-caption-1 font-bold">Booking #12345</div>
                                    </div>
                                )}
                                {verificationStatus === "invalid" && (
                                    <div className="flex flex-col items-center gap-2">
                                        <XCircle className="h-12 w-12 text-white fill-white/20" />
                                        <h3 className="text-title-2 font-bold">Access Denied</h3>
                                        <div className="bg-white/20 px-3 py-1 rounded-full text-caption-1 font-bold">Invalid / Expired</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Manual Entry */}
            <div className="glass-card p-4 rounded-ios-xl shadow-ios-sm">
                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                    <Keyboard className="h-4 w-4" />
                    <span className="text-caption-1 font-bold uppercase tracking-wider">Manual Entry</span>
                </div>
                <div className="flex gap-3">
                    <Input
                        placeholder="······"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        maxLength={6}
                        className="text-center font-mono text-title-3 tracking-[0.5em] uppercase h-12 bg-muted/20 border-transparent focus:bg-background focus:border-primary rounded-ios-md"
                    />
                    <Button onClick={() => handleVerify(passcode)} disabled={passcode.length < 6} className="h-12 w-24 rounded-ios-md font-bold shadow-ios-sm">
                        Verify
                    </Button>
                </div>
            </div>
        </div>
    );
}
