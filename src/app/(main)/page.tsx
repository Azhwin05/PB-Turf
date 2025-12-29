import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Zap, Trophy, User, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="p-5 space-y-6 pb-32">
            {/* Header */}
            <header className="flex justify-between items-center pt-4">
                <div>
                    <h1 className="text-large-title font-bold text-foreground">Arena</h1>
                    <p className="text-subheadline text-muted-foreground mt-1">Welcome back, Player!</p>
                </div>
                <Link href="/profile">
                    <div className="h-11 w-11 glass-card rounded-full flex items-center justify-center hover:glass-elevated transition-all duration-200 press-scale min-h-touch min-w-touch">
                        <User className="h-5 w-5 text-foreground" />
                    </div>
                </Link>
            </header>

            {/* Hero / Quick Action */}
            <section>
                <Card className="glass-liquid relative overflow-hidden group border-0 border-white/20">
                    <div className="shimmer-overlay" />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-title-2 font-semibold mb-2 text-foreground">Play Today</h2>
                                <p className="text-callout text-muted-foreground mb-6">3 slots available this evening.</p>
                                <Link href="/book">
                                    <Button size="default" className="shadow-primary-glow">
                                        Book Now
                                    </Button>
                                </Link>
                            </div>
                            <Calendar className="h-16 w-16 text-primary/20 group-hover:scale-110 transition-transform duration-300 ease-spring" />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Happening Today (Mock) */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-title-3 font-semibold text-foreground">Happening Today</h3>
                    <Link href="/events" className="flex items-center gap-1 text-footnote text-primary hover:opacity-70 transition-opacity">
                        <span>View All</span>
                        <ChevronRight className="h-3 w-3" />
                    </Link>
                </div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <Card key={i} className="overflow-hidden hover:glass-elevated transition-all duration-200 group press-scale">
                            <div className="flex">
                                <div className="glass-subtle w-16 flex flex-col items-center justify-center border-r border-border">
                                    <span className="text-caption-2 font-semibold text-muted-foreground uppercase tracking-wider">OCT</span>
                                    <span className="text-title-2 font-bold text-foreground">28</span>
                                </div>
                                <div className="p-4 flex-1">
                                    <h4 className="text-callout font-semibold text-foreground mb-1">Open Match: Intermediate</h4>
                                    <p className="text-footnote text-muted-foreground">6:00 PM - 7:30 PM • 3/4 Players</p>
                                </div>
                                <div className="flex items-center pr-4">
                                    <Button size="sm" variant="outline" className="h-9 text-footnote">Join</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Deals */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-title-3 font-semibold flex items-center gap-2 text-foreground">
                        <Zap className="h-5 w-5 text-warning fill-warning" />
                        Deals
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 bg-warning/5 border-2 border-warning/20 hover:border-warning/40 hover:shadow-warning-glow transition-all duration-200 press-scale">
                        <div className="text-caption-2 font-semibold text-warning mb-2 uppercase tracking-wider">Tomorrow</div>
                        <div className="text-title-3 font-bold text-foreground">11:00 AM</div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <div className="text-footnote text-muted-foreground line-through">₹800</div>
                            <div className="text-callout font-bold text-warning">₹400</div>
                        </div>
                    </Card>
                    <Card className="p-4 bg-warning/5 border-2 border-warning/20 hover:border-warning/40 hover:shadow-warning-glow transition-all duration-200 press-scale">
                        <div className="text-caption-2 font-semibold text-warning mb-2 uppercase tracking-wider">Tomorrow</div>
                        <div className="text-title-3 font-bold text-foreground">2:00 PM</div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <div className="text-footnote text-muted-foreground line-through">₹800</div>
                            <div className="text-callout font-bold text-warning">₹400</div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Stats Teaser */}
            <section>
                <Card className="glass-elevated">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center border-2 border-warning/20">
                                <Trophy className="h-6 w-6 text-warning" />
                            </div>
                            <div>
                                <div className="text-footnote text-muted-foreground">Your XP</div>
                                <div className="text-title-3 font-semibold text-foreground">1,250 XP</div>
                            </div>
                        </div>
                        <Link href="/leaderboard">
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                View
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
