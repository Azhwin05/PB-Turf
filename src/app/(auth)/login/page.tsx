"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Phone, ArrowRight, CheckCircle2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Reset OTP when switching back to phone
    useEffect(() => {
        if (step === "phone") setOtp("");
    }, [step]);

    const handleSendOtp = async () => {
        if (phone.length < 10) {
            toast.error("Please enter a valid 10-digit number");
            return;
        }
        setLoading(true);
        // Fake delay for realism
        setTimeout(() => {
            setLoading(false);
            setStep("otp");
            toast.success("OTP sent to your mobile!");
        }, 1500);
    };

    const handleVerifyOtp = async () => {
        if (otp !== "1234") {
            toast.error("Invalid OTP. Try 1234");
            return;
        }

        setLoading(true);

        const specificEmail = `${phone}@demo.com`;
        const masterEmail = `master_demo@pbturf.com`;
        const commonPassword = `password1234`;

        // Helper to attempt login
        const attemptLogin = async (email: string) => {
            return await supabase.auth.signInWithPassword({
                email,
                password: commonPassword,
            });
        };

        try {
            // 1. Try Specific User (Preferred)
            console.log("Attempting specific login:", specificEmail);
            const { data: specificData, error: specificError } = await attemptLogin(specificEmail);

            if (!specificError && specificData.session) {
                // Success with specific user
                toast.success("Login Successful!");
                router.push("/");
                router.refresh();
                return;
            }

            // If specific failed (Rate Limit, Unconfirmed, or Not Found), try to create it?
            // User reported Rate Limits on creation. So we skip creation loop if it's suspicious.
            // But let's try one clean SignUp if it was "Invalid login credentials" (User Not Found)
            if (specificError && specificError.message.includes("Invalid login credentials")) {
                 const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: specificEmail,
                    password: commonPassword,
                    options: { data: { phone } }
                });
                
                if (signUpData.session) {
                    toast.success("Account Created & Logged In!");
                    router.push("/");
                    router.refresh();
                    return;
                }
                // If SignUp failed (Rate limit etc), fall through to Master
                console.warn("Specific SignUp failed:", signUpError?.message);
            }

            // 2. Fallback to Master User (The "Static" Guarantee)
            console.log("Falling back to Master User...");
            const { data: masterData, error: masterError } = await attemptLogin(masterEmail);

            if (masterData.session) {
                // Store the REAL phone for display purposes
                localStorage.setItem("user_phone", phone);
                toast.success("Login Successful (Demo Mode)");
                router.push("/");
                router.refresh();
                return;
            }

            // 3. Last Resort: Anonymous Login (The "Guaranteed" Fallback)
            console.log("Master login failed. Falling back to Anonymous...");
            const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously({
                 options: {
                     data: { phone } // Store phone in metadata
                 }
            });

            if (anonData?.session) {
                localStorage.setItem("user_phone", phone);
                toast.success("Login Successful (Anonymous Mode)");
                router.push("/");
                router.refresh();
                return;
            }

            // If even Anonymous fails, only then throw error
            if (anonError) {
                 console.error("Anonymous login failed:", anonError);
                 throw new Error(anonError.message || "All Login Methods Failed");
            }

        } catch (err: any) {
            console.error("Login Critical Failure:", err);
            toast.error(`Login Error: ${err.message || "Unknown error"}. Please wait 60s if rate limited.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-5 bg-background overflow-hidden relative selection:bg-primary/30">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Glass Card - Using Standard glass-card class */}
                <div className="glass-card rounded-3xl overflow-hidden relative shadow-ios-xl">
                    
                    <div className="p-8 pt-10 relative z-10">
                        {/* Header */}
                        <div className="text-center space-y-3 mb-8">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="mx-auto h-20 w-20 rounded-full glass-liquid border-4 border-white/20 flex items-center justify-center shadow-lg relative overflow-hidden"
                            >
                                <div className="shimmer-overlay" />
                                <Trophy className="h-8 w-8 text-primary" />
                            </motion.div>
                            <div className="space-y-1">
                                <h1 className="text-large-title font-bold text-foreground tracking-tight">Welcome</h1>
                                <p className="text-body text-muted-foreground">Enter your mobile number to play</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="relative min-h-[160px]">
                            <AnimatePresence mode="wait">
                                {step === "phone" ? (
                                    <motion.div
                                        key="phone-step"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-caption-1 font-semibold text-muted-foreground uppercase tracking-wider ml-1">Mobile Number</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-muted-foreground font-medium">+91</span>
                                                </div>
                                                <Input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 10) setPhone(val);
                                                    }}
                                                    placeholder="98765 43210"
                                                    className="pl-12 h-12 bg-muted/20 border-transparent hover:bg-muted/30 focus:bg-background focus:border-primary/50 text-foreground placeholder:text-muted-foreground rounded-xl text-lg tracking-wide transition-all duration-300"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-12 text-body font-semibold rounded-xl shadow-ios transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                            onClick={handleSendOtp}
                                            disabled={loading || phone.length < 10}
                                        >
                                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                                                <span className="flex items-center">
                                                    Get OTP <ArrowRight className="ml-2 h-4 w-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="otp-step"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-2 text-center">
                                            <label className="text-caption-1 font-semibold text-muted-foreground uppercase tracking-wider">Enter OTP</label>
                                            <Input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 4) setOtp(val);
                                                }}
                                                placeholder="••••"
                                                className="h-14 text-center text-3xl tracking-[0.5em] font-mono bg-muted/20 border-transparent focus:bg-background focus:border-primary/50 text-foreground rounded-xl transition-all duration-300 placeholder:text-muted-foreground/30"
                                                autoFocus
                                                maxLength={4}
                                            />
                                            <p className="text-caption-1 text-muted-foreground">Sent to +91 {phone}</p>
                                        </div>

                                        <Button
                                            className="w-full h-12 text-body font-semibold rounded-xl shadow-ios transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                            onClick={handleVerifyOtp}
                                            disabled={loading || otp.length < 4}
                                        >
                                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                                                <span className="flex items-center">
                                                    Verify & Login <CheckCircle2 className="ml-2 h-4 w-4" />
                                                </span>
                                            )}
                                        </Button>

                                        <button
                                            onClick={() => setStep("phone")}
                                            className="w-full text-caption-1 font-medium text-primary hover:text-primary/80 transition-colors py-2"
                                            disabled={loading}
                                        >
                                            Change Phone Number
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-caption-2 text-muted-foreground mt-6">
                    By continuing, you agree to our Terms & Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
}
