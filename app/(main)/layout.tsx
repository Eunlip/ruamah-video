import React from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-surface">
            {/* Main content area */}
            <main className="flex-1 pb-16 relative w-full max-w-md mx-auto">
                {children}
            </main>

            {/* Bottom Navigation */}
            <div className="w-full max-w-md mx-auto">
                <BottomNav />
            </div>
        </div>
    );
}
