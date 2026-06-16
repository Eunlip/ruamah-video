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
        <div
            className={`flex min-h-[100dvh] flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-[1000ms] ${
                isReady ? "bg-surface" : "bg-[#050505]"
            }`}
        >
            {/* Background Glow untuk Layar Login */}
            <div
                className={`absolute top-[0%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#eef0ff] rounded-full blur-[80px] pointer-events-none transition-all duration-[1200ms] ${
                    isReady ? "opacity-60 scale-110" : "opacity-0 scale-50"
                }`}
            />

            {/* SPLASH SCREEN (Logo) */}
            <div
                className={`absolute inset-0 flex flex-col items-center justify-center z-20 transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isReady
                        ? "opacity-0 -translate-y-[20vh] scale-75 blur-md pointer-events-none"
                        : "opacity-100 translate-y-0 scale-100 blur-0"
                }`}
            >
                <div className="relative group">
                    {/* Glow Effect di belakang logo */}
                    <div className="absolute -inset-6 bg-gradient-to-r from-orange-400/20 to-amber-600/20 blur-[40px] rounded-full opacity-100 mix-blend-screen" />

                    {/* Logo */}
                    <img
                        src="/logo.png"
                        alt="Rumah Video Logo"
                        className="relative w-64 h-64 object-contain rounded-[48px] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] bg-[#0f0f0f] drop-shadow-[0_0_30px_rgba(251,146,60,0.15)]"
                    />
                </div>
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
