"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Phone } from "lucide-react";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendOtp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            phone: phone,
        });

        if (error) {
            alert("Error sending OTP: " + error.message);
        } else {
            setStep("otp");
        }
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.verifyOtp({
            phone: phone,
            token: otp,
            type: "sms",
        });

        if (error) {
            alert("Invalid OTP");
        } else {
            router.push("/");
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <Card className="w-full max-w-sm relative z-10 border-white/10 bg-slate-900/60 backdrop-blur-3xl shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2 border border-primary/50 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                        <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                    <CardDescription className="text-slate-400">
                        {step === "phone" ? "Enter your mobile number to get started" : "Enter the code sent to your mobile"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === "phone" ? (
                        <div className="space-y-4">
                            <Input
                                type="tel"
                                placeholder="+91 99999 99999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="text-center text-lg tracking-wider"
                            />
                            <Button
                                className="w-full font-bold text-md h-12 shadow-lg hover:shadow-primary/25 transition-all"
                                onClick={handleSendOtp}
                                disabled={loading || phone.length < 10}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send OTP"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="------"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="text-center text-2xl tracking-[0.5em] font-mono"
                                maxLength={6}
                            />
                            <Button
                                className="w-full font-bold text-md h-12"
                                onClick={handleVerifyOtp}
                                disabled={loading || otp.length < 6}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Login"}
                            </Button>
                            <button
                                onClick={() => setStep("phone")}
                                className="w-full text-xs text-slate-500 hover:text-white transition-colors"
                                disabled={loading}
                            >
                                Change Phone Number
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
