"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface User {
    nama: string;
    nrp: string;
    role: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            // Menggunakan setTimeout untuk menunda state update agar tidak memicu 
            // peringatan "synchronous setState in effect" (Cascading renders).
            setTimeout(() => {
                setUser(JSON.parse(storedUser));
            }, 0);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.replace("/");
    };

    const getInitials = (name: string) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    };

    const initials = user ? getInitials(user.nama) : "?";

    return (
        <div className="flex flex-col min-h-[100dvh] pt-8 px-6 pb-24 bg-surface">
            <header className="mb-8">
                <h1 className="font-display text-3xl font-bold text-on-surface">
                    Profil Saya
                </h1>
            </header>

            <div className="flex flex-col items-center mt-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-primary text-on-primary rounded-full mb-4 flex items-center justify-center text-4xl font-bold shadow-lg shadow-primary/20">
                    {initials}
                </div>
                <h2 className="text-xl font-bold text-on-surface text-center">
                    {user ? user.nama : "Memuat..."}
                </h2>
                <p className="text-on-surface-variant text-sm mt-1 font-mono">
                    {user ? user.nrp : "---"}
                </p>
                {user && (
                    <div className="mt-3 bg-primary/10 px-3 py-1 rounded-full text-[12px] font-bold tracking-wider text-primary">
                        {user.role}
                    </div>
                )}

                <div className="w-full mt-12">
                    <Button
                        variant="ghost"
                        className="w-full flex items-center gap-2 justify-center p-4 h-auto rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-500/20 active:bg-red-500/30 transition-colors font-bold text-[16px]"
                        onClick={handleLogout}
                    >
                        Keluar
                    </Button>
                </div>
            </div>
        </div>
    );
}
