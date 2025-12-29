"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CalendarCheck, Percent, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    return (
        <div className="space-y-6 pb-10 p-5">
            <h1 className="text-large-title font-bold text-foreground">Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card border-0 shadow-ios-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-caption-1 font-medium uppercase tracking-wide text-muted-foreground">Total Bookings</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CalendarCheck className="h-4 w-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-title-1 font-bold text-foreground">12 <span className="text-title-3 text-muted-foreground font-medium">/ 16</span></div>
                        <p className="text-caption-1 text-muted-foreground mt-1">Slots filled today</p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-0 shadow-ios-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-caption-1 font-medium uppercase tracking-wide text-muted-foreground">Occupancy</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                            <Percent className="h-4 w-4 text-success" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-title-1 font-bold text-foreground">75%</div>
                        <p className="text-caption-1 text-success mt-1 flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                            +5% from yesterday
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-0 shadow-ios-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-caption-1 font-medium uppercase tracking-wide text-muted-foreground">Unique Players</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-title-1 font-bold text-foreground">24</div>
                        <p className="text-caption-1 text-muted-foreground mt-1">Active this week</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-elevated border-0 shadow-ios-md overflow-hidden">
                <CardHeader className="bg-muted/5 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-title-3 font-semibold text-foreground">Empty Slots Action</CardTitle>
                    </div>
                    <CardDescription className="text-subheadline text-muted-foreground">Slots that need attention</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors">
                            <div>
                                <p className="text-body font-semibold text-foreground">Today, 2:00 PM</p>
                                <p className="text-caption-1 text-muted-foreground">Off-peak • 50% fill rate</p>
                            </div>
                            <Button size="sm" variant="outline" className="border-warning text-warning hover:bg-warning/10 h-8 rounded-ios-sm font-medium">
                                Mark as Deal (-50%)
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors">
                            <div>
                                <p className="text-body font-semibold text-foreground">Today, 3:00 PM</p>
                                <p className="text-caption-1 text-muted-foreground">Off-peak • 20% fill rate</p>
                            </div>
                            <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10 h-8 rounded-ios-sm font-medium">
                                Create Open Match
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
