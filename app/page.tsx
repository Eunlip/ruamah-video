"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Tahan splash screen selama 1.5 detik, lalu mulai transisi "Premium"
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 relative overflow-hidden bg-surface">
            {/* Background Glow */}
            <div
                className={`absolute top-[0%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#eef0ff] rounded-full blur-[80px] pointer-events-none transition-all duration-1000 ${isReady ? "opacity-60 scale-110" : "opacity-100 scale-100"}`}
            />

            {/* SPLASH SCREEN (Logo & Title) */}
            <div
                className={`absolute inset-0 flex flex-col items-center justify-center z-20 transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isReady
                        ? "opacity-0 -translate-y-[20vh] scale-75 blur-md pointer-events-none"
                        : "opacity-100 translate-y-0 scale-100 blur-0"
                }`}
            >
                <img
                    src="/logo.png"
                    alt="Rumah Video Logo"
                    className="w-28 h-28 object-contain mb-5 drop-shadow-[0_16px_32px_rgba(67,63,229,0.4)]"
                />
                <h1 className="font-display text-[36px] font-[800] text-primary tracking-tight">
                    Rumah Video
                </h1>
            </div>

            {/* LOGIN SCREEN (Welcome & Form) */}
            <div
                className={`w-full max-w-sm flex flex-col z-10 transition-all duration-[1200ms] delay-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isReady
                        ? "opacity-100 translate-y-0 blur-0"
                        : "opacity-0 translate-y-[15vh] blur-lg pointer-events-none"
                }`}
            >
                <div className="w-full text-left mb-8 mt-4">
                    <h2 className="font-display text-[32px] font-[800] text-on-surface leading-tight mb-2">
                        Selamat Datang
                    </h2>
                    <p className="text-on-surface-variant text-[16px] font-sans">
                        Masuk untuk mengelola video Anda.
                    </p>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
