import React from "react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    return (
        <div className="flex flex-col min-h-screen pt-8 px-6 pb-24">
            <header className="mb-8">
                <h1 className="font-display text-3xl font-bold text-on-surface">
                    Profile
                </h1>
            </header>

            <div className="flex flex-col items-center mt-4">
                <div className="w-24 h-24 bg-surface-container rounded-full mb-4"></div>
                <h2 className="text-xl font-bold text-on-surface">
                    Admin User
                </h2>
                <p className="text-on-surface-variant text-sm">123456789</p>

                <div className="w-full mt-10">
                    <Button variant="ghost" className="w-full">
                        Keluar
                    </Button>
                </div>
            </div>
        </div>
    );
}
