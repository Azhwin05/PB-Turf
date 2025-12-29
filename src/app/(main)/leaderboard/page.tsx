"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
    const players = [
        { rank: 1, name: "Arun M.", xp: 2450, matches: 42, winRate: "68%" },
        { rank: 2, name: "Sarah J.", xp: 2100, matches: 38, winRate: "60%" },
        { rank: 3, name: "Mike R.", xp: 1950, matches: 35, winRate: "55%" },
        { rank: 4, name: "Priya S.", xp: 1800, matches: 30, winRate: "58%" },
        { rank: 5, name: "David K.", xp: 1650, matches: 28, winRate: "50%" },
        { rank: 6, name: "You", xp: 1250, matches: 20, winRate: "52%" }, // Current User
        { rank: 7, name: "Tom B.", xp: 1100, matches: 18, winRate: "48%" },
    ];

    return (
        <div className="p-5 space-y-8 pb-32">
            <div className="text-center space-y-1 pt-4">
                <h1 className="text-large-title font-bold text-foreground">Leaderboard</h1>
                <p className="text-subheadline text-muted-foreground">Weekly Rankings</p>
            </div>

            {/* Top 3 Podium (Visual) */}
            <div className="flex justify-center items-end gap-3 py-4">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-slate-400 shadow-ios flex items-center justify-center -mb-2 z-10">
                        <span className="text-caption-1 font-bold text-slate-700">2</span>
                    </div>
                    <div className="h-28 w-20 glass-card rounded-t-ios-xl border-x border-t flex flex-col items-center justify-center p-2 shadow-ios-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-500/10" />
                        <div className="h-10 w-10 rounded-full bg-slate-300 mb-2 border border-white/20 relative z-10" />
                        <span className="text-caption-1 font-bold truncate w-full text-center text-foreground relative z-10">{players[1].name}</span>
                        <span className="text-caption-2 text-muted-foreground relative z-10">{players[1].xp}</span>
                    </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center">
                    <Crown className="h-8 w-8 text-warning mb-2 drop-shadow-lg animate-bounce duration-[2000ms]" />
                    <div className="h-36 w-24 glass-card rounded-t-ios-xl border-x border-t border-warning/30 flex flex-col items-center justify-center p-2 relative shadow-warning-glow overflow-hidden">
                        <div className="absolute inset-0 bg-warning/10" />
                        <div className="h-14 w-14 rounded-full bg-warning/20 mb-2 border-2 border-warning shadow-lg relative z-10" />
                        <span className="text-subheadline font-bold truncate w-full text-center text-foreground relative z-10">{players[0].name}</span>
                        <span className="text-caption-1 font-bold text-warning relative z-10">{players[0].xp} XP</span>
                    </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-orange-200 border-2 border-orange-400 shadow-ios flex items-center justify-center -mb-2 z-10">
                        <span className="text-caption-1 font-bold text-orange-800">3</span>
                    </div>
                    <div className="h-24 w-20 glass-card rounded-t-ios-xl border-x border-t flex flex-col items-center justify-center p-2 shadow-ios-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-orange-500/10" />
                        <div className="h-10 w-10 rounded-full bg-orange-300 mb-2 border border-white/20 relative z-10" />
                        <span className="text-caption-1 font-bold truncate w-full text-center text-foreground relative z-10">{players[2].name}</span>
                        <span className="text-caption-2 text-muted-foreground relative z-10">{players[2].xp}</span>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {players.slice(3).map((player) => (
                    <Card key={player.rank} className={cn("border-0 shadow-ios-sm transition-all duration-300",
                        player.name === "You" ? "bg-primary/5 border-2 border-primary/20 shadow-primary-glow scale-[1.02] z-10" : "glass-card hover:glass-elevated press-scale"
                    )}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="text-callout font-bold text-muted-foreground w-6 text-center">{player.rank}</div>
                            <div className="h-10 w-10 rounded-full bg-muted/20 border border-border flex items-center justify-center text-callout font-semibold text-foreground">
                                {player.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h4 className={cn("text-callout font-semibold", player.name === "You" ? "text-primary" : "text-foreground")}>{player.name}</h4>
                                <p className="text-caption-1 text-muted-foreground">{player.matches} Matches • {player.winRate} Win Rate</p>
                            </div>
                            <div className="text-caption-1 font-bold text-foreground glass-subtle px-2 py-1 rounded-ios-sm">{player.xp} XP</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
