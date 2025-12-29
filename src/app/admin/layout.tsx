"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, ScanLine, LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/schedule", label: "Schedule", icon: Calendar },
        { href: "/admin/access", label: "Scanner", icon: ScanLine },
    ];

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar (Desktop) / Bottom Bar (Mobile) - For now simplified as Sidebar for admin usually desktop but requirements say Mobile + Desktop */}
            {/* effectively, let's make a top bar for Admin to save space on mobile */}

            <div className="flex-1 flex flex-col">
                <header className="bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
                    <div className="font-bold text-lg">Admin Panel</div>
                    <nav className="flex gap-4">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity",
                                    pathname === item.href && "opacity-100 font-bold text-yellow-500"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </header>
                <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
