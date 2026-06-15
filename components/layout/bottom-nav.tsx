"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, User } from "lucide-react";

export function BottomNav() {
    const pathname = usePathname();

    const tabs = [
        {
            name: "Home",
            href: "/home",
            icon: Home,
        },
        {
            name: "Profile",
            href: "/profile",
            icon: User,
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-surface-dim pb-safe w-full max-w-md mx-auto">
            <div className="flex justify-around items-center h-16">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    // match active exactly, or starting with for active states in sub-routes
                    const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
                                isActive
                                    ? "text-primary"
                                    : "text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={isActive ? "scale-110 transition-transform" : "transition-transform"}
                            />
                            <span
                                className={`text-[10px] font-medium ${
                                    isActive ? "font-bold" : "font-medium"
                                }`}
                            >
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
