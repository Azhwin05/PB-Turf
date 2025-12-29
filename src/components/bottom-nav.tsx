"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Calendar, Trophy, User } from "lucide-react";
import { motion } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/book", label: "Book", icon: Calendar },
        { href: "/events", label: "Events", icon: Trophy },
        { href: "/profile", label: "Profile", icon: User },
    ];

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 pb-safe-bottom px-4 pt-2 z-50 pointer-events-none"
        >
            <div className="glass-liquid-nav flex justify-around items-center h-16 pointer-events-auto max-w-md mx-auto relative overflow-hidden">

                {/* Organic Light Refraction Blob */}
                <div className="liquid-blob" />

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={true}
                            style={{ touchAction: "manipulation" }}
                            className="flex flex-col items-center justify-center min-w-touch h-full px-2 relative z-10"
                        >
                            <div className="relative p-2">
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.05 : 1,
                                        y: isActive ? -2 : 0,
                                        filter: isActive ? "drop-shadow(0 0 8px rgba(0, 122, 255, 0.4))" : "none"
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 40 }}
                                >
                                    <item.icon className={cn(
                                        "h-6 w-6 transition-colors duration-500",
                                        isActive ? "text-primary fill-primary/20" : "text-muted-foreground"
                                    )} />
                                </motion.div>
                            </div>
                            {/* Removed text label for cleaner visionOS look, or keep very subtle */}
                        </Link>
                    );
                })}
            </div>
        </motion.div>
    );
}

