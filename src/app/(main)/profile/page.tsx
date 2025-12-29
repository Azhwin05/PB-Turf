"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Uses new gradient styles
import { Input } from "@/components/ui/input";   // Uses new glass styles
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Uses new glass styles
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, CreditCard, Loader2, LogOut, Settings, Trophy, User, Bell, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [fullName, setFullName] = useState("");
    const [skillLevel, setSkillLevel] = useState("Beginner");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                setProfile(profile);
                setFullName(profile.full_name || "");
                setSkillLevel(profile.skill_level || "Beginner");
            }
            setLoading(false);
        };

        getUser();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // or refresh to trigger middleware redirect
        router.refresh();
    };

    const handleSave = async () => {
        setSaving(true);
        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: fullName,
                skill_level: skillLevel
            })
            .eq("id", user.id);

        if (error) {
            alert("Error updating profile");
        } else {
            alert("Profile updated!");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-5 pt-safe-top space-y-8 max-w-lg mx-auto">
                <div className="flex justify-between items-center w-full">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex flex-col items-center space-y-4 w-full py-6">
                    <Skeleton className="h-28 w-28 rounded-full" />
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-4 w-full">
                    <Skeleton className="h-32 w-full rounded-ios-xl" />
                    <Skeleton className="h-14 w-full rounded-ios-xl" />
                    <Skeleton className="h-14 w-full rounded-ios-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen max-w-lg mx-auto pb-32">
            <div className="p-5 space-y-8">
                <div className="flex justify-between items-center pt-4">
                    <h1 className="text-large-title font-bold text-foreground">My Profile</h1>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full">
                        <LogOut className="h-6 w-6" />
                    </Button>
                </div>

                {/* Avatar Section */}
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="h-28 w-28 rounded-full glass-liquid border-4 border-white/10 shadow-ios-lg flex items-center justify-center relative mb-4 overflow-hidden">
                        <div className="shimmer-overlay" />
                        <User className="h-12 w-12 text-slate-500 dark:text-slate-400" />
                        <div className="absolute bottom-0 right-0 bg-primary h-9 w-9 rounded-full border-4 border-background flex items-center justify-center shadow-sm">
                            <Trophy className="h-4 w-4 text-white fill-white" />
                        </div>
                    </div>
                    <h2 className="text-title-2 font-bold text-foreground">{fullName || "Pickleball Player"}</h2>
                    <p className="text-subheadline text-muted-foreground">{user?.phone || user?.email}</p>
                </div>

                {/* Edit Form */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-caption-1 font-medium text-muted-foreground uppercase tracking-wide ml-4">Personal Details</h3>
                        <div className="glass-card rounded-ios-xl overflow-hidden p-0 border-0 shadow-ios-sm">
                            <div className="p-4 border-b border-border/50">
                                <Label htmlFor="fullname" className="sr-only">Full Name</Label>
                                <Input
                                    id="fullname"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="border-none bg-transparent h-auto p-0 text-body font-normal placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none w-full"
                                />
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                <Label className="text-subheadline text-muted-foreground">Skill Level</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setSkillLevel(level)}
                                            className={cn(
                                                "py-1.5 px-1 rounded-ios-sm text-caption-1 font-semibold transition-all duration-200",
                                                skillLevel === level
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                                            )}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full h-12 text-body font-semibold rounded-ios-md shadow-ios hover:shadow-primary-glow">
                    {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Save Changes
                </Button>

                {/* Menu Options - iOS Settings Style */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-caption-1 font-medium text-muted-foreground uppercase tracking-wide ml-4">Preferences</h3>
                        <div className="glass-card rounded-ios-xl overflow-hidden p-0 border-0 shadow-ios-sm">
                            <button className="w-full flex items-center justify-between p-4 border-b border-border/50 bg-transparent hover:bg-muted/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center text-white">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <span className="text-body font-medium text-foreground">Payment Methods</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 border-b border-border/50 bg-transparent hover:bg-muted/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-purple-500 flex items-center justify-center text-white">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <span className="text-body font-medium text-foreground">Notifications</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-muted/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-md bg-slate-500 flex items-center justify-center text-white">
                                        <Settings className="h-5 w-5" />
                                    </div>
                                    <span className="text-body font-medium text-foreground">App Settings</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
